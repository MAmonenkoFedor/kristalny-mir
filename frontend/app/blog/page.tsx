import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { getPosts } from '@/lib/site';
import { formatDate, mediaUrl } from '@/lib/defaults';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Блог — Кристальный Мир',
  description: 'Полезные статьи о коммерческом клининге, инвентаризации ТМЦ и аутсорсинге персонала.',
};

const fallbackGrad = 'linear-gradient(150deg, oklch(0.87 0.07 198), oklch(0.7 0.12 205))';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <PageHero
        eyebrow="Блог"
        title="Полезное о клининге, учёте и персонале"
        subtitle="Делимся опытом и разбираем вопросы, которые чаще всего возникают у наших клиентов."
      />

      <section className="pb-8">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => {
            const cover = mediaUrl(p.coverUrl);
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                data-reveal
                data-delay={((i % 3) + 1).toString()}
                className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-out-quart hover:-translate-y-1.5 hover:border-brand hover:shadow-lift"
              >
                <div className="relative h-44 overflow-hidden">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out-quart group-hover:scale-105" style={{ background: p.grad ?? fallbackGrad }} />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-brand-ink backdrop-blur">{p.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>{formatDate(p.date)}</span>
                    <span aria-hidden>·</span>
                    <span>{p.readMinutes} мин</span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold leading-snug text-ink">{p.title}</h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong transition-[gap] duration-200 ease-out-quart group-hover:gap-3">
                    Читать <Icon.arrow className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
