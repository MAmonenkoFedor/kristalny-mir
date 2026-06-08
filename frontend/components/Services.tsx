import { iconMap, Icon } from './icons';
import type { ServiceItem } from '@/lib/defaults';

export function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow"><Icon.sparkles className="h-3.5 w-3.5" /> Услуги</span>
          <h2 className="mt-5 text-3xl font-bold text-ink sm:text-[2.6rem]">Три направления услуг</h2>
          <p className="mt-4 text-lg text-muted">
            Закрываем ключевые бизнес-процессы: чистота, учёт и персонал — с договором, документами и гарантией.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const IconC = iconMap[s.icon] ?? Icon.sparkles;
            return (
              <article
                key={s.id ?? s.title}
                data-reveal
                data-delay={((i % 3) + 1).toString()}
                className="card group hover:-translate-y-1.5 hover:border-brand hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-strong transition-colors duration-300 ease-out-quart group-hover:bg-brand group-hover:text-white">
                    <IconC className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold text-brand-ink">{s.price}</span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>

                <ul className="mt-5 space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                      <Icon.check className="h-4 w-4 shrink-0 text-brand-strong" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong transition-[gap] duration-200 ease-out-quart hover:gap-3">
                  Заказать <Icon.arrow className="h-4 w-4" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
