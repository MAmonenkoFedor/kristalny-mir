'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks, mediaUrl, type SiteConfig } from '@/lib/defaults';
import { Icon } from './icons';

export function Navbar({ site }: { site: SiteConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logo = mediaUrl(site.logoUrl);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out-quart"
      style={{
        backgroundColor: scrolled ? 'oklch(0.998 0.003 220 / 0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 var(--line)' : 'none',
      }}
    >
      <nav className="container-page flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={site.brandName} className="h-9 w-auto max-w-[160px] object-contain" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-glow">
              <Icon.sparkles className="h-5 w-5" />
            </span>
          )}
          {!logo && (
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              {site.brandName}
            </span>
          )}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out-quart hover:bg-brand-soft hover:text-brand-ink ${
                    active ? 'text-brand-ink' : 'text-muted'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href={site.phoneHref} className="text-sm font-semibold text-ink">{site.phone}</a>
          <Link href="/contact" className="btn-primary !px-5 !py-2.5 !text-sm">
            Оставить заявку
          </Link>
        </div>

        <button
          type="button"
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink md:hidden"
        >
          {open ? <Icon.close className="h-5 w-5" /> : <Icon.menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-line md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-brand-soft">
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-2">Оставить заявку</Link>
          </div>
        </div>
      )}
    </header>
  );
}
