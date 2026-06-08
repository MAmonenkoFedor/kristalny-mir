import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { getGallery } from '@/lib/site';
import { mediaUrl } from '@/lib/defaults';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Галерея работ — Кристальный Мир',
  description: 'Примеры выполненных проектов: клининг офисов и складов, инвентаризация ТМЦ, обеспечение персоналом.',
};

const iconByCat: Record<string, (typeof Icon)['sparkles']> = {
  Клининг: Icon.sparkles,
  Инвентаризация: Icon.clipboard,
  Персонал: Icon.users,
};

const fallbackGrad = 'linear-gradient(150deg, oklch(0.87 0.07 198), oklch(0.7 0.12 205))';

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <main>
      <PageHero
        eyebrow="Галерея"
        title="Наши проекты"
        subtitle="Несколько примеров объектов, на которых мы обеспечивали чистоту, порядок в учёте и людей на местах."
      />

      <section className="pb-8">
        <div className="container-page grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const IconC = iconByCat[p.category] ?? Icon.sparkles;
            const img = mediaUrl(p.imageUrl);
            return (
              <article
                key={p.id ?? p.title}
                data-reveal
                data-delay={((i % 3) + 1).toString()}
                className={`group relative overflow-hidden rounded-3xl border border-line shadow-soft ${p.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 transition-transform duration-500 ease-out-quart group-hover:scale-105" style={{ background: p.grad ?? fallbackGrad }} />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, oklch(0.25 0.04 230 / 0.55), transparent 55%)' }} />
                <IconC className="absolute right-5 top-5 h-12 w-12 text-white/40" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-brand-ink backdrop-blur">{p.category}</span>
                  <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{p.meta}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand title="Хотите такой же результат?" text="Расскажите о вашем объекте — подготовим расчёт и план работ." />
    </main>
  );
}
