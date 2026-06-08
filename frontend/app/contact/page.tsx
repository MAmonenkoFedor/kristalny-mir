import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { LeadForm } from '@/components/LeadForm';
import { Faq } from '@/components/Faq';
import { getSite, getServices } from '@/lib/site';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Контакты — Кристальный Мир',
  description: 'Свяжитесь с ООО «Кристальный Мир Трейд» в Минске: телефон, почта, адрес и форма заявки.',
};

export default async function ContactPage() {
  const [site, services] = await Promise.all([getSite(), getServices()]);

  const cards = [
    { icon: Icon.phone, label: 'Телефон', value: site.phone, href: site.phoneHref },
    { icon: Icon.mail, label: 'Почта', value: site.email, href: site.emailHref },
    { icon: Icon.pin, label: 'Адрес', value: `${site.address}, ${site.country}` },
    { icon: Icon.clock, label: 'Часы работы', value: site.workingHours },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Контакты"
        title="Свяжитесь с нами"
        subtitle="Оставьте заявку или позвоните — ответим на вопросы, рассчитаем стоимость и предложим решение под вашу задачу."
      />

      <section className="pb-4">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            const IconC = c.icon;
            const inner = (
              <div data-reveal data-delay={((i % 4) + 1).toString()} className="card h-full">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-strong"><IconC className="h-6 w-6" /></span>
                <p className="mt-5 text-xs uppercase tracking-wide text-muted">{c.label}</p>
                <p className="mt-1.5 font-semibold text-ink">{c.value}</p>
              </div>
            );
            return c.href ? (
              <a key={c.label} href={c.href} className="block">{inner}</a>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </div>
      </section>

      <LeadForm site={site} services={services} />
      <Faq />
    </main>
  );
}
