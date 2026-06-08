import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Lead } from '@prisma/client';

const serviceLabels: Record<string, string> = {
  cleaning: 'Коммерческий клининг',
  inventory: 'Независимая инвентаризация',
  staff: 'Аутсорсинг персонала',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const port = Number(SMTP_PORT ?? 587);
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465, // 465 = SSL, 587 = STARTTLS
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
    } else {
      this.logger.warn('SMTP не настроен — email-уведомления отключены');
    }

    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      this.logger.warn('Telegram не настроен — уведомления в TG отключены');
    }
  }

  /** Отправляет уведомление о новой заявке во все каналы. Никогда не бросает исключения. */
  async notifyNewLead(lead: Lead): Promise<void> {
    await Promise.allSettled([this.sendEmail(lead), this.sendTelegram(lead)]);
  }

  private serviceLabel(lead: Lead): string {
    if (!lead.service) return '—';
    return serviceLabels[lead.service] ?? lead.service;
  }

  private async sendEmail(lead: Lead): Promise<void> {
    if (!this.transporter) return;

    const to = process.env.MAIL_TO ?? process.env.SMTP_USER!;
    const from =
      process.env.MAIL_FROM ?? `"Кристальный Мир" <${process.env.SMTP_USER}>`;
    const service = this.serviceLabel(lead);

    try {
      await this.transporter.sendMail({
        from,
        to,
        replyTo: lead.phone,
        subject: `Новая заявка с сайта — ${lead.name}`,
        text:
          `Новая заявка с сайта «Кристальный Мир»\n\n` +
          `Имя: ${lead.name}\n` +
          `Телефон: ${lead.phone}\n` +
          `Услуга: ${service}\n` +
          (lead.comment ? `Комментарий: ${lead.comment}\n` : '') +
          `\nВремя: ${lead.createdAt.toLocaleString('ru-RU')}`,
        html:
          `<h2 style="margin:0 0 12px">Новая заявка с сайта</h2>` +
          `<table style="border-collapse:collapse;font-family:sans-serif;font-size:15px">` +
          `<tr><td style="padding:4px 12px 4px 0;color:#667"><b>Имя</b></td><td>${escapeHtml(lead.name)}</td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#667"><b>Телефон</b></td><td>${escapeHtml(lead.phone)}</td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#667"><b>Услуга</b></td><td>${escapeHtml(service)}</td></tr>` +
          (lead.comment
            ? `<tr><td style="padding:4px 12px 4px 0;color:#667;vertical-align:top"><b>Комментарий</b></td><td>${escapeHtml(lead.comment)}</td></tr>`
            : '') +
          `</table>`,
      });
      this.logger.log(`Email-уведомление отправлено (заявка #${lead.id})`);
    } catch (e) {
      this.logger.error(`Email не отправлен: ${(e as Error).message}`);
    }
  }

  private async sendTelegram(lead: Lead): Promise<void> {
    const text = [
      '🧽 <b>Новая заявка с сайта</b>',
      '',
      `<b>Имя:</b> ${escapeHtml(lead.name)}`,
      `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
      `<b>Услуга:</b> ${escapeHtml(this.serviceLabel(lead))}`,
      lead.comment ? `<b>Комментарий:</b> ${escapeHtml(lead.comment)}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join('\n');

    try {
      await this.postTelegram(text);
      this.logger.log(`Telegram-уведомление отправлено (заявка #${lead.id})`);
    } catch (e) {
      this.logger.error(`Telegram не отправлен: ${(e as Error).message}`);
    }
  }

  /** Публичная отправка произвольного HTML-текста в Telegram (например, дневная сводка). */
  async sendTelegramMessage(text: string): Promise<void> {
    try {
      await this.postTelegram(text);
    } catch (e) {
      this.logger.error(`Telegram-сообщение не отправлено: ${(e as Error).message}`);
    }
  }

  /** Низкоуровневая отправка в Telegram. Бросает при ошибке; no-op, если канал не настроен. */
  private async postTelegram(text: string): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      throw new Error(`Telegram API ответил ${res.status}`);
    }
  }
}
