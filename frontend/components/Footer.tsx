import Link from 'next/link';
import { navLinks, mediaUrl, type SiteConfig, type ServiceItem } from '@/lib/defaults';
import { Icon } from './icons';

export function Footer({ site, services }: { site: SiteConfig; services: ServiceItem[] }) {
  const logo = mediaUrl(site.logoUrl);

  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={site.brandName} className="h-9 w-auto max-w-[160px] object-contain" />
              ) : (
                <>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-glow">
                    <Icon.sparkles className="h-5 w-5" />
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{site.brandName}</span>
                </>
              )}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{site.footerAbout}</p>

            <dl className="mt-6 space-y-1.5 text-sm text-muted">
              <div className="flex gap-2"><dt className="text-muted">Адрес:</dt><dd>{site.address}, {site.country}</dd></div>
              <div className="flex gap-2"><dt className="text-muted">УНП:</dt><dd>{site.unp}</dd></div>
              <div className="flex gap-2"><dt className="text-muted">Р/с:</dt><dd>{site.account}</dd></div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink">Разделы</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors duration-200 hover:text-brand-strong">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink">Услуги</h3>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.id ?? s.title}>
                  <Link href="/services" className="text-sm text-muted transition-colors duration-200 hover:text-brand-strong">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">© {new Date().getFullYear()} {site.brandName}. Все права защищены.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href={site.phoneHref} className="font-semibold text-ink hover:text-brand-strong">{site.phone}</a>
            <a href={site.emailHref} className="text-muted hover:text-brand-strong">{site.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
