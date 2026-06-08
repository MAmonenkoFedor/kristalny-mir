import { Icon } from './icons';
import type { SiteConfig } from '@/lib/defaults';

export function Hero({ site }: { site: SiteConfig }) {
  const { hero, stats } = site;

  return (
    <section id="top" className="relative overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 right-[-10%] h-[440px] w-[440px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, oklch(0.72 0.118 196 / 0.35), transparent 65%)' }} />
        <div className="absolute top-40 left-[-12%] h-[380px] w-[380px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, oklch(0.78 0.09 210 / 0.28), transparent 65%)' }} />
      </div>

      <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div data-reveal>
          <span className="eyebrow"><Icon.pin className="h-3.5 w-3.5" /> {hero.eyebrow}</span>

          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] text-ink sm:text-6xl">
            {hero.titleLine1}
            <br />
            {hero.titleLine2}{' '}
            <span className="relative whitespace-nowrap text-brand-strong">
              {hero.accent}
              <svg className="absolute -bottom-2 left-0 h-3 w-full text-brand" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                <path d="M2 9C60 3 120 3 180 6C220 8 260 9 298 4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{hero.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="/contact" className="btn-primary">Рассчитать стоимость <Icon.arrow className="h-4 w-4" /></a>
            <a href="/services" className="btn-ghost">Смотреть услуги</a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-bold text-ink sm:text-[1.7rem]">{s.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal data-delay="2" className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-line bg-surface-2 shadow-lift">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, oklch(0.955 0.03 196), oklch(0.92 0.05 205))' }} />
            <div className="absolute inset-0 grid place-items-center">
              <Icon.sparkles className="h-40 w-40" style={{ color: 'oklch(0.72 0.118 196 / 0.4)' }} />
            </div>

            <div className="glass absolute left-5 top-5 flex items-center gap-3 rounded-2xl border border-line p-3.5 shadow-soft animate-float">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-strong"><Icon.star className="h-5 w-5" /></span>
              <div>
                <p className="font-display text-base font-bold leading-none text-ink">4.9 / 5</p>
                <p className="mt-1 text-xs text-muted">Оценка клиентов</p>
              </div>
            </div>

            <div className="glass absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-line p-3.5 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white"><Icon.shield className="h-5 w-5" /></span>
              <div>
                <p className="font-display text-sm font-bold leading-none text-ink">Гарантия 100%</p>
                <p className="mt-1 text-xs text-muted">Переделаем бесплатно</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
