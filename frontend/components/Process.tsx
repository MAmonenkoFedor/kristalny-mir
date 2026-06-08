import { steps } from '@/lib/defaults';
import { Icon } from './icons';

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div data-reveal className="lg:sticky lg:top-28">
            <span className="eyebrow"><Icon.clock className="h-3.5 w-3.5" /> Как мы работаем</span>
            <h2 className="mt-5 text-3xl font-bold text-ink sm:text-[2.6rem]">
              Четыре шага до результата
            </h2>
            <p className="mt-4 text-lg text-muted">
              Прозрачный процесс без сюрпризов: вы всегда знаете, что и когда происходит,
              и сколько это стоит.
            </p>
            <a href="#contact" className="btn-primary mt-8">
              Начать с заявки <Icon.arrow className="h-4 w-4" />
            </a>
          </div>

          <ol className="relative space-y-4">
            <span className="absolute left-[34px] top-4 bottom-4 hidden w-px bg-line sm:block" aria-hidden />
            {steps.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                data-delay={((i % 4) + 1).toString()}
                className="card relative flex gap-5 hover:border-brand"
              >
                <span className="z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white font-display text-lg font-bold shadow-glow">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
