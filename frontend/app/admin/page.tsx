'use client';

import { useEffect, useState } from 'react';
import { login, checkAuth, tokenStore } from '@/lib/adminClient';
import { LeadsTab } from '@/components/admin/LeadsTab';
import { SiteTab } from '@/components/admin/SiteTab';
import { ServicesTab } from '@/components/admin/ServicesTab';
import { GalleryTab } from '@/components/admin/GalleryTab';
import { BlogTab } from '@/components/admin/BlogTab';
import { Icon } from '@/components/icons';

type Tab = 'leads' | 'site' | 'services' | 'gallery' | 'blog';
const tabs: { id: Tab; label: string }[] = [
  { id: 'leads', label: 'Заявки' },
  { id: 'site', label: 'Сайт' },
  { id: 'services', label: 'Услуги' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'blog', label: 'Блог' },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('leads');

  // форма входа
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth().then(setAuthed).catch(() => setAuthed(false));
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      setAuthed(true);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    tokenStore.clear();
    setAuthed(false);
    setPassword('');
  }

  if (authed === null) {
    return <main className="grid min-h-screen place-items-center"><p className="text-muted">Загрузка…</p></main>;
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-lift">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-glow"><Icon.sparkles className="h-5 w-5" /></span>
            <span className="font-display text-lg font-bold text-ink">Админка</span>
          </div>
          <p className="mt-3 text-sm text-muted">Войдите, чтобы управлять сайтом и заявками.</p>
          <form onSubmit={onLogin} className="mt-6 space-y-4">
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="field" required />
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" className="field" required />
            {error && <p className="text-sm text-[oklch(0.5_0.13_25)]">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Вход…' : 'Войти'}</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white"><Icon.sparkles className="h-4 w-4" /></span>
            <span className="font-display font-bold text-ink">Кристальный Мир · админ</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-muted hover:text-brand-strong">Открыть сайт ↗</a>
            <button onClick={logout} className="btn-ghost !px-4 !py-2 !text-sm">Выйти</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-2 sm:px-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                tab === t.id ? 'bg-brand text-white' : 'text-muted hover:bg-brand-soft hover:text-brand-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {tab === 'leads' && <LeadsTab />}
        {tab === 'site' && <SiteTab />}
        {tab === 'services' && <ServicesTab />}
        {tab === 'gallery' && <GalleryTab />}
        {tab === 'blog' && <BlogTab />}
      </div>
    </main>
  );
}
