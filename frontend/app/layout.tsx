import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { getSite, getServices } from '@/lib/site';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SiteChrome } from '@/components/SiteChrome';
import './globals.css';

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: `${site.brandName} — клининг, инвентаризация и аутсорсинг персонала в Минске`,
    description:
      'ООО «Кристальный Мир Трейд» — аутсорсинг бизнес-процессов в Минске: коммерческий клининг, независимая инвентаризация ТМЦ и предоставление квалифицированного персонала. Договор, документы, гарантия.',
    keywords: ['клининг Минск', 'коммерческий клининг', 'инвентаризация ТМЦ', 'аутсорсинг персонала', 'Кристальный Мир'],
    openGraph: {
      title: `${site.brandName} — сервис для вашего бизнеса`,
      description: 'Коммерческий клининг, инвентаризация ТМЦ и аутсорсинг персонала в Минске. Ответ на заявку за 15 минут.',
      locale: 'ru_BY',
      type: 'website',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, services] = await Promise.all([getSite(), getServices()]);

  return (
    <html lang="ru" className={sans.variable}>
      <body>
        <SiteChrome site={site} services={services}>
          {children}
        </SiteChrome>
        <ScrollReveal />
      </body>
    </html>
  );
}
