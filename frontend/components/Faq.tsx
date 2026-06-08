'use client';

import { useState } from 'react';
import { faqs } from '@/lib/defaults';
import { Icon } from './icons';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal>
            <span className="eyebrow"><Icon.doc className="h-3.5 w-3.5" /> Вопросы</span>
            <h2 className="mt-5 text-3xl font-bold text-ink sm:text-[2.4rem]">
              Частые вопросы
            </h2>
            <p className="mt-4 text-lg text-muted">
              Не нашли ответ? Напишите нам — подскажем по вашей задаче.
            </p>
          </div>

          <div data-reveal data-delay="1" className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-ink">{f.q}</span>
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong transition-transform duration-300 ease-out-quart"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <div
                    className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out-quart"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="min-h-0">
                      <p className="px-6 pb-5 text-[0.95rem] leading-relaxed text-muted">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
