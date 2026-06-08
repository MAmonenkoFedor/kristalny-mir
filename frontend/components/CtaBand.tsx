import Link from 'next/link';
import { getSite } from '@/lib/site';
import { Icon } from './icons';

export async function CtaBand({
  title = 'Готовы обсудить ваш проект?',
  text = 'Оставьте заявку — рассчитаем стоимость и предложим решение под ваши задачи. Ответ в течение 15 минут.',
}: {
  title?: string;
  text?: string;
}) {
  const site = await getSite();

  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-12 text-center sm:px-12 sm:py-16"
          style={{ background: 'linear-gradient(165deg, oklch(0.34 0.06 210), oklch(0.46 0.1 202))' }}
        >
          <div
            className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, oklch(0.72 0.118 196 / 0.4), transparent 70%)' }}
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/75">{text}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Оставить заявку <Icon.arrow className="h-4 w-4" />
            </Link>
            <a href={site.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-[0.95rem] font-semibold text-white transition-colors duration-200 ease-out-quart hover:bg-white/20">
              <Icon.phone className="h-4 w-4" /> {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
