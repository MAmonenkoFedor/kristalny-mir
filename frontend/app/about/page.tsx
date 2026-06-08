import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { getSite } from '@/lib/site';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'О компании — Кристальный Мир',
  description:
    'ООО «Кристальный Мир Трейд» — надёжный партнёр по аутсорсингу бизнес-процессов в Минске: клининг, инвентаризация ТМЦ и персонал.',
};

const advIcons = { shield: Icon.shield, doc: Icon.doc, users: Icon.users, chart: Icon.chart };

export default async function AboutPage() {
  const site = await getSite();

  const requisites = [
    { label: 'Полное наименование', value: 'ООО «Кристальный Мир Трейд»' },
    { label: 'Адрес', value: `${site.address}, ${site.country}` },
    { label: 'УНП', value: site.unp },
    { label: 'Расчётный счёт', value: site.account },
    { label: 'Банк', value: site.bank },
  ];

  return (
    <main>
      <PageHero
        eyebrow="О компании"
        title="Партнёр, на которого можно положиться"
        subtitle="Мы помогаем бизнесу в Минске держать под контролем чистоту, учёт и персонал — чтобы вы могли сосредоточиться на главном."
      />

      <section className="py-12">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div data-reveal className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              <span className="font-semibold text-ink">{site.brandName}</span> — компания полного цикла
              по аутсорсингу бизнес-процессов. Мы объединили три востребованных направления:
              коммерческий клининг, независимую инвентаризацию ТМЦ и предоставление персонала.
            </p>
            <p>
              Работаем с юридическими лицами и ИП по договору, со своим оборудованием и обученной
              командой. Для каждого клиента подбираем решение под реальные задачи и сопровождаем его
              прозрачной отчётностью.
            </p>
            <p>
              Наша цель проста — снять с вас рутину и обеспечить результат, за который мы отвечаем
              документально.
            </p>
          </div>

          <div data-reveal data-delay="1" className="grid grid-cols-2 gap-4">
            {site.stats.map((s) => (
              <div key={s.label} className="card text-center">
                <p className="font-display text-3xl font-extrabold text-brand-strong">{s.value}</p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div data-reveal className="max-w-2xl">
            <span className="eyebrow"><Icon.shield className="h-3.5 w-3.5" /> Принципы</span>
            <h2 className="mt-5 text-3xl font-bold text-ink sm:text-[2.4rem]">Как мы работаем</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.advantages.map((a, i) => {
              const IconC = advIcons[a.icon] ?? Icon.check;
              return (
                <div key={a.title} data-reveal data-delay={((i % 4) + 1).toString()} className="card">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
                    <IconC className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div
            data-reveal
            className="overflow-hidden rounded-[2.5rem] border border-line p-8 sm:p-12"
            style={{ background: 'linear-gradient(165deg, oklch(0.97 0.02 205), oklch(0.93 0.045 200))' }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white shadow-glow">
                <Icon.doc className="h-6 w-6" />
              </span>
              <h2 className="text-2xl font-bold text-ink">Реквизиты</h2>
            </div>
            <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {requisites.map((r) => (
                <div key={r.label} className="border-b border-white/50 pb-4">
                  <dt className="text-xs uppercase tracking-wide text-brand-ink">{r.label}</dt>
                  <dd className="mt-1 font-semibold text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
