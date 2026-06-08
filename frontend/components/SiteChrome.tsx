'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { SiteConfig, ServiceItem } from '@/lib/defaults';

/**
 * Шапка и футер показываются на публичных страницах,
 * но скрываются в админке (/admin).
 */
export function SiteChrome({
  site,
  services,
  children,
}: {
  site: SiteConfig;
  services: ServiceItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar site={site} />
      {children}
      <Footer site={site} services={services} />
    </>
  );
}
