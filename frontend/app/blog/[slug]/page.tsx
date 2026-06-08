import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/CtaBand';
import { getPost, getPosts } from '@/lib/site';
import { formatDate, mediaUrl } from '@/lib/defaults';
import { Icon } from '@/components/icons';

const fallbackGrad = 'linear-gradient(150deg, oklch(0.87 0.07 198), oklch(0.7 0.12 205))';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Статья не найдена' };
  return { title: `${post.title} — Кристальный Мир`, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const all = await getPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const cover = mediaUrl(post.coverUrl);

  return (
    <main>
      <article className="pt-[120px] sm:pt-[140px]">
        <div className="container-page max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand-strong">
            <Icon.arrow className="h-4 w-4 rotate-180" /> Все статьи
          </Link>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink">{post.category}</span>
            <span>{formatDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span>{post.readMinutes} мин чтения</span>
          </div>

          <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] text-ink sm:text-[2.75rem]">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
        </div>

        <div className="container-page mt-10 max-w-3xl">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={post.title} className="h-56 w-full rounded-[2rem] border border-line object-cover sm:h-72" />
          ) : (
            <div className="h-56 w-full rounded-[2rem] border border-line sm:h-72" style={{ background: post.grad ?? fallbackGrad }} />
          )}
        </div>

        <div className="container-page mt-12 max-w-3xl">
          <div className="space-y-8">
            {post.body.map((b, i) => (
              <div key={i}>
                {b.heading && <h2 className="mb-3 text-2xl font-bold text-ink">{b.heading}</h2>}
                <p className="text-[1.05rem] leading-[1.75] text-muted">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <section className="py-20 sm:py-24">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-ink">Читайте также</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((p) => {
              const c = mediaUrl(p.coverUrl);
              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-out-quart hover:-translate-y-1.5 hover:border-brand hover:shadow-lift"
                >
                  {c ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c} alt={p.title} className="h-32 w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-105" />
                  ) : (
                    <div className="h-32 transition-transform duration-500 ease-out-quart group-hover:scale-105" style={{ background: p.grad ?? fallbackGrad }} />
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-brand-ink">{p.category}</span>
                    <h3 className="mt-2 text-base font-bold leading-snug text-ink">{p.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
