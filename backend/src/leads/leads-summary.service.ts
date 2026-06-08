import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * Раз в день собирает статистику по заявкам и отправляет сводку в Telegram.
 * Время задаётся cron-выражением ниже (по умолчанию 09:00 по Минску).
 * Чтобы поменять время — отредактируйте выражение в декораторе @Cron.
 */
@Injectable()
export class LeadsSummaryService {
  private readonly logger = new Logger(LeadsSummaryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 9 * * *', { name: 'daily-leads-summary', timeZone: 'Europe/Minsk' })
  async sendDailySummary(): Promise<void> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [createdToday, totalNew, inProgress, doneToday] = await Promise.all([
      this.prisma.lead.count({ where: { createdAt: { gte: startOfDay } } }),
      this.prisma.lead.count({ where: { status: 'NEW' } }),
      this.prisma.lead.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.lead.count({
        where: { status: 'DONE', updatedAt: { gte: startOfDay } },
      }),
    ]);

    const dateLabel = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });

    const text = [
      `📊 <b>Сводка по заявкам</b> · ${dateLabel}`,
      '',
      `🆕 Новых за сегодня: <b>${createdToday}</b>`,
      `📥 Всего необработанных: <b>${totalNew}</b>`,
      `⚙️ В работе: <b>${inProgress}</b>`,
      `✅ Выполнено за сегодня: <b>${doneToday}</b>`,
    ].join('\n');

    await this.notifications.sendTelegramMessage(text);
    this.logger.log('Ежедневная сводка отправлена в Telegram');
  }
}
