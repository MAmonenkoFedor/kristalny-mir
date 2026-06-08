import { Icon } from './icons';
import type { Advantage } from '@/lib/defaults';

const advIcons = {
  shield: Icon.shield,
  doc: Icon.doc,
  users: Icon.users,
  chart: Icon.chart,
};

export function Advantages({ advantages }: { advantages: Advantage[] }) {
  return (
    <section id="advantages" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <div
          className="overflow-hidden rounded-[2.5rem] border border-line p-8 sm:p-12 lg:p-16"
          style={{ background: 'linear-gradient(165deg, oklch(0.97 0.02 205), oklch(0.93 0.045 200))' }}
        >
          <div data-reveal className="max-w-2xl">
            <span className="eyebrow"><Icon.shield className="h-3.5 w-3.5" /> Почему мы</span>
            <h2 className="mt-5 text-3xl font-bold text-ink sm:text-[2.6rem]">Премиальный сервис в каждой детали</h2>
            <p className="mt-4 text-lg text-brand-ink">
              Мы отвечаем за результат и не оставляем мелочей без внимания — потому что качество
              складывается именно из них.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a, i) => {
              const IconC = advIcons[a.icon] ?? Icon.check;
              return (
                <div
                  key={a.title}
                  data-reveal
                  data-delay={((i % 4) + 1).toString()}
                  className="glass rounded-3xl border border-white/60 p-6 shadow-soft transition-transform duration-300 ease-out-quart hover:-translate-y-1.5"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-glow">
                    <IconC className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
