'use client';

import { useState } from 'react';
import { apiUrl, type SiteConfig, type ServiceItem } from '@/lib/defaults';
import { Icon } from './icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function LeadForm({ site, services }: { site: SiteConfig; services: ServiceItem[] }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      service: String(data.get('service') ?? ''),
      comment: String(data.get('comment') ?? '').trim(),
    };

    if (payload.name.length < 2 || payload.phone.length < 6) {
      setStatus('error');
      setError('Укажите имя и корректный телефон.');
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const res = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Не удалось отправить заявку.');
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error && err.message
          ? `${err.message} Позвоните нам: ${site.phone}.`
          : 'Что-то пошло не так. Попробуйте ещё раз.',
      );
    }
  }

  const contacts = [
    { icon: Icon.phone, label: 'Телефон', value: site.phone, href: site.phoneHref },
    { icon: Icon.mail, label: 'Почта', value: site.email, href: site.emailHref },
    { icon: Icon.pin, label: 'Адрес', value: site.address },
    { icon: Icon.clock, label: 'Часы работы', value: site.workingHours },
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-10 overflow-hidden rounded-[2.5rem] border border-line bg-surface shadow-lift lg:grid-cols-[1fr_1.1fr]">
          <div
            data-reveal
            className="relative flex flex-col justify-between gap-10 p-8 sm:p-12"
            style={{ background: 'linear-gradient(165deg, oklch(0.34 0.06 210), oklch(0.45 0.09 205))' }}
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
                <Icon.sparkles className="h-3.5 w-3.5" /> Заявка
              </span>
              <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">Оставьте заявку — рассчитаем за 15 минут</h2>
              <p className="mt-4 max-w-md text-white/75">
                Заполните форму, и менеджер свяжется с вами, уточнит детали и назовёт точную стоимость. Без обязательств.
              </p>
            </div>

            <ul className="space-y-4">
              {contacts.map((c) => {
                const IconC = c.icon;
                const inner = (
                  <span className="flex items-center gap-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/12 text-white"><IconC className="h-5 w-5" /></span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-white/55">{c.label}</span>
                      <span className="block text-sm font-semibold text-white">{c.value}</span>
                    </span>
                  </span>
                );
                return <li key={c.label}>{c.href ? <a href={c.href}>{inner}</a> : inner}</li>;
              })}
            </ul>
          </div>

          <div data-reveal data-delay="1" className="p-8 sm:p-12">
            {status === 'success' ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-strong"><Icon.check className="h-8 w-8" /></span>
                <h3 className="mt-6 text-2xl font-bold text-ink">Заявка принята!</h3>
                <p className="mt-3 max-w-sm text-muted">Спасибо! Мы свяжемся с вами в ближайшее время. Обычно отвечаем в течение 15 минут.</p>
                <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-7">Отправить ещё одну</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Ваше имя">
                    <input name="name" autoComplete="name" placeholder="Анна" className="field" required />
                  </Field>
                  <Field label="Телефон">
                    <input name="phone" type="tel" autoComplete="tel" placeholder="+375 (29) 123-45-67" className="field" required />
                  </Field>
                </div>

                <Field label="Услуга">
                  <select name="service" defaultValue={services[0]?.title ?? ''} className="field">
                    {services.map((s) => (
                      <option key={s.id ?? s.title} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Комментарий" optional>
                  <textarea name="comment" rows={3} placeholder="Площадь, адрес, удобное время…" className="field resize-none" />
                </Field>

                {status === 'error' && (
                  <p className="rounded-xl bg-[oklch(0.95_0.05_25)] px-4 py-3 text-sm text-[oklch(0.45_0.13_25)]">{error}</p>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-70">
                  {status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}
                  {status !== 'loading' && <Icon.arrow className="h-4 w-4" />}
                </button>

                <p className="text-center text-xs text-muted">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label} {optional && <span className="font-normal text-muted">— необязательно</span>}
      </span>
      {children}
    </label>
  );
}
