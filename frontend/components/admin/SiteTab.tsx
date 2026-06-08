'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/adminClient';
import { defaultSite, type SiteConfig, type AdvIcon } from '@/lib/defaults';
import { Field, Input, Textarea, Select, Btn, Card, ImageUpload, StatusNote } from './ui';

const advIconOptions: { value: AdvIcon; label: string }[] = [
  { value: 'shield', label: 'Щит (гарантия)' },
  { value: 'doc', label: 'Документ' },
  { value: 'users', label: 'Люди' },
  { value: 'chart', label: 'График' },
];

export function SiteTab() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    apiGet<SiteConfig | null>('/content/site')
      .then((s) => setSite(s ? { ...defaultSite, ...s, hero: { ...defaultSite.hero, ...s.hero } } : defaultSite))
      .catch(() => setSite(defaultSite));
  }, []);

  if (!site) return <p className="text-muted">Загрузка…</p>;

  const set = (patch: Partial<SiteConfig>) => setSite({ ...site, ...patch });
  const setHero = (patch: Partial<SiteConfig['hero']>) => setSite({ ...site, hero: { ...site.hero, ...patch } });

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      await apiSend('PUT', '/admin/content/site', site);
      setStatus({ kind: 'ok', text: 'Сохранено. Обновите сайт, чтобы увидеть изменения.' });
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-ink">Шапка и логотип</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Название бренда"><Input value={site.brandName} onChange={(e) => set({ brandName: e.target.value })} /></Field>
          <ImageUpload label="Логотип (если задан — заменит название)" value={site.logoUrl} onChange={(url) => set({ logoUrl: url })} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-ink">Контакты</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Телефон (отображение)"><Input value={site.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Телефон (ссылка tel:)" hint="например, tel:+375445252429"><Input value={site.phoneHref} onChange={(e) => set({ phoneHref: e.target.value })} /></Field>
          <Field label="Email"><Input value={site.email} onChange={(e) => set({ email: e.target.value })} /></Field>
          <Field label="Email (ссылка mailto:)"><Input value={site.emailHref} onChange={(e) => set({ emailHref: e.target.value })} /></Field>
          <Field label="Адрес"><Input value={site.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          <Field label="Страна/регион"><Input value={site.country} onChange={(e) => set({ country: e.target.value })} /></Field>
          <Field label="Часы работы"><Input value={site.workingHours} onChange={(e) => set({ workingHours: e.target.value })} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-ink">Реквизиты</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Расчётный счёт"><Input value={site.account} onChange={(e) => set({ account: e.target.value })} /></Field>
          <Field label="Банк"><Input value={site.bank} onChange={(e) => set({ bank: e.target.value })} /></Field>
          <Field label="УНП"><Input value={site.unp} onChange={(e) => set({ unp: e.target.value })} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-ink">Главный экран (hero)</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Надпись сверху (eyebrow)"><Input value={site.hero.eyebrow} onChange={(e) => setHero({ eyebrow: e.target.value })} /></Field>
          <Field label="Заголовок — строка 1"><Input value={site.hero.titleLine1} onChange={(e) => setHero({ titleLine1: e.target.value })} /></Field>
          <Field label="Заголовок — строка 2"><Input value={site.hero.titleLine2} onChange={(e) => setHero({ titleLine2: e.target.value })} /></Field>
          <Field label="Акцентное слово (подчёркнуто)"><Input value={site.hero.accent} onChange={(e) => setHero({ accent: e.target.value })} /></Field>
        </div>
        <div className="mt-5">
          <Field label="Подзаголовок"><Textarea rows={3} value={site.hero.subtitle} onChange={(e) => setHero({ subtitle: e.target.value })} /></Field>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Цифры (статистика)</h3>
          <Btn variant="ghost" type="button" onClick={() => set({ stats: [...site.stats, { value: '', label: '' }] })}>+ Добавить</Btn>
        </div>
        <div className="space-y-3">
          {site.stats.map((st, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-3">
              <Input placeholder="100+" value={st.value} onChange={(e) => { const stats = [...site.stats]; stats[i] = { ...st, value: e.target.value }; set({ stats }); }} />
              <Input placeholder="довольных клиентов" value={st.label} onChange={(e) => { const stats = [...site.stats]; stats[i] = { ...st, label: e.target.value }; set({ stats }); }} />
              <Btn variant="danger" type="button" onClick={() => set({ stats: site.stats.filter((_, j) => j !== i) })}>Удалить</Btn>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Преимущества</h3>
          <Btn variant="ghost" type="button" onClick={() => set({ advantages: [...site.advantages, { title: '', text: '', icon: 'shield' }] })}>+ Добавить</Btn>
        </div>
        <div className="space-y-4">
          {site.advantages.map((a, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[1fr_2fr_160px_auto]">
              <Input placeholder="Заголовок" value={a.title} onChange={(e) => { const advantages = [...site.advantages]; advantages[i] = { ...a, title: e.target.value }; set({ advantages }); }} />
              <Input placeholder="Описание" value={a.text} onChange={(e) => { const advantages = [...site.advantages]; advantages[i] = { ...a, text: e.target.value }; set({ advantages }); }} />
              <Select value={a.icon} onChange={(e) => { const advantages = [...site.advantages]; advantages[i] = { ...a, icon: e.target.value as AdvIcon }; set({ advantages }); }}>
                {advIconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
              <Btn variant="danger" type="button" onClick={() => set({ advantages: site.advantages.filter((_, j) => j !== i) })}>Удалить</Btn>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-display text-lg font-bold text-ink">Футер</h3>
        <Field label="Текст о компании в футере"><Textarea rows={3} value={site.footerAbout} onChange={(e) => set({ footerAbout: e.target.value })} /></Field>
      </Card>

      <div className="sticky bottom-4 z-10 flex items-center gap-4 rounded-2xl border border-line bg-surface/95 p-4 shadow-lift backdrop-blur">
        <Btn type="button" onClick={save} disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить настройки'}</Btn>
        <StatusNote status={status} />
      </div>
    </div>
  );
}
