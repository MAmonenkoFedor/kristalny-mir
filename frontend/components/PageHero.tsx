import { Icon } from './icons';

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-[120px] pb-12 sm:pt-[140px] sm:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div
          className="absolute -top-24 right-[8%] h-[320px] w-[320px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.118 196 / 0.28), transparent 65%)' }}
        />
      </div>

      <div className="container-page" data-reveal>
        <span className="eyebrow"><Icon.sparkles className="h-3.5 w-3.5" /> {eyebrow}</span>
        <h1 className="mt-5 max-w-3xl text-[2.2rem] font-extrabold leading-[1.05] text-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
