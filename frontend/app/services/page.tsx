import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { Process } from '@/components/Process';
import { Faq } from '@/components/Faq';
import { CtaBand } from '@/components/CtaBand';
import { getServices } from '@/lib/site';
import { iconMap, Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Услуги — Кристальный Мир',
  description:
    'Коммерческий клининг, независимая инвентаризация ТМЦ и аутсорсинг персонала в Минске. Договор, документы и гарантия результата.',
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      <PageHero
        eyebrow="Услуги"
        title="Три направления для вашего бизнеса"
        subtitle="Берём на себя процессы, которые отвлекают от основного дела: чистоту объектов, учёт ТМЦ и обеспечение персоналом."
      />

      <section className="pb-8">
        <div className="container-page space-y-6">
          {services.map((s) => {
            const IconC = iconMap[s.icon] ?? Icon.sparkles;
            return (
              <article
                key={s.id ?? s.title}
                id={s.id ?? undefined}
                data-reveal
                className="card scroll-mt-24 grid gap-7 sm:grid-cols-[auto_1fr] sm:p-9"
              >
                <div className="flex sm:block">
                  <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white shadow-glow">
                    <IconC className="h-8 w-8" />
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-ink">{s.title}</h2>
                    <span className="rounded-full bg-surface-2 px-4 py-1.5 text-sm font-semibold text-brand-ink">{s.price}</span>
                  </div>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">{s.long}</p>

                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm font-medium text-ink">
                        <Icon.check className="h-4 w-4 shrink-0 text-brand-strong" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Process />
      <Faq />
      <CtaBand />
    </main>
  );
}
