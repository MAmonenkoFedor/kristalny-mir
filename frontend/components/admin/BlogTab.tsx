'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/adminClient';
import type { PostItem, Block } from '@/lib/defaults';
import { Field, Input, Textarea, Select, Btn, Card, ImageUpload, StatusNote } from './ui';

const categories = ['Клининг', 'Инвентаризация', 'Персонал'];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9а-я]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export function BlogTab() {
  const [items, setItems] = useState<PostItem[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => apiGet<PostItem[]>('/admin/content/posts').then(setItems).catch(() => setStatus({ kind: 'err', text: 'Не удалось загрузить статьи' }));
  useEffect(() => { load(); }, []);

  const patch = (i: number, p: Partial<PostItem>) => setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...p } : it)));
  const patchBlock = (i: number, bi: number, p: Partial<Block>) =>
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, body: it.body.map((b, k) => (k === bi ? { ...b, ...p } : b)) } : it)));

  async function save(i: number) {
    const p = items[i];
    if (!p.slug.trim()) { setStatus({ kind: 'err', text: 'Укажите slug (адрес статьи)' }); return; }
    setBusyId(p.id ?? `new-${i}`);
    setStatus(null);
    try {
      const saved = p.id
        ? await apiSend<PostItem>('PUT', `/admin/content/posts/${p.id}`, p)
        : await apiSend<PostItem>('POST', '/admin/content/posts', p);
      setItems((prev) => prev.map((it, j) => (j === i ? saved : it)));
      setStatus({ kind: 'ok', text: 'Статья сохранена' });
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(i: number) {
    const p = items[i];
    if (!confirm('Удалить статью?')) return;
    try {
      if (p.id) await apiSend('DELETE', `/admin/content/posts/${p.id}`);
      setItems((prev) => prev.filter((_, j) => j !== i));
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    }
  }

  function add() {
    const draft: PostItem = {
      slug: '', title: 'Новая статья', excerpt: '', category: 'Клининг',
      date: new Date().toISOString().slice(0, 10), readMinutes: 4, coverUrl: null, grad: null,
      body: [{ text: '' }], published: true,
    };
    setItems((prev) => [draft, ...prev]);
    setOpen(0);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <StatusNote status={status} />
        <Btn type="button" onClick={add}>+ Новая статья</Btn>
      </div>

      {items.map((p, i) => (
        <Card key={p.id ?? `new-${i}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.published ? 'bg-[oklch(0.7_0.14_150)]' : 'bg-line'}`} title={p.published ? 'Опубликована' : 'Черновик'} />
              <div>
                <p className="font-semibold text-ink">{p.title}</p>
                <p className="text-xs text-muted">/{p.slug || '—'} · {p.category}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Btn type="button" variant="ghost" onClick={() => setOpen(open === i ? null : i)}>{open === i ? 'Свернуть' : 'Редактировать'}</Btn>
              <Btn type="button" variant="danger" onClick={() => remove(i)}>Удалить</Btn>
            </div>
          </div>

          {open === i && (
            <div className="mt-5 border-t border-line pt-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Заголовок"><Input value={p.title} onChange={(e) => patch(i, { title: e.target.value })} /></Field>
                <Field label="Slug (адрес)" hint="латиницей, например kak-vybrat-klining">
                  <div className="flex gap-2">
                    <Input value={p.slug} onChange={(e) => patch(i, { slug: e.target.value })} />
                    <Btn type="button" variant="ghost" onClick={() => patch(i, { slug: slugify(p.title) })}>Из названия</Btn>
                  </div>
                </Field>
                <Field label="Категория">
                  <Select value={p.category} onChange={(e) => patch(i, { category: e.target.value })}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Дата (ГГГГ-ММ-ДД)"><Input value={p.date} onChange={(e) => patch(i, { date: e.target.value })} /></Field>
                <Field label="Время чтения (мин)"><Input type="number" value={p.readMinutes} onChange={(e) => patch(i, { readMinutes: Number(e.target.value) })} /></Field>
                <label className="flex items-center gap-3 self-end pb-3">
                  <input type="checkbox" checked={p.published ?? true} onChange={(e) => patch(i, { published: e.target.checked })} className="h-5 w-5 accent-[oklch(0.63_0.13_198)]" />
                  <span className="text-sm font-medium text-ink">Опубликована</span>
                </label>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="Краткое описание (анонс)"><Textarea rows={2} value={p.excerpt} onChange={(e) => patch(i, { excerpt: e.target.value })} /></Field>
                <ImageUpload label="Обложка (если нет — градиент)" value={p.coverUrl} onChange={(url) => patch(i, { coverUrl: url })} />
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-ink">Текст статьи (блоки)</h4>
                  <Btn type="button" variant="ghost" onClick={() => patch(i, { body: [...p.body, { text: '' }] })}>+ Блок</Btn>
                </div>
                <div className="space-y-4">
                  {p.body.map((b, bi) => (
                    <div key={bi} className="rounded-xl border border-line p-4">
                      <Input placeholder="Подзаголовок (необязательно)" value={b.heading ?? ''} onChange={(e) => patchBlock(i, bi, { heading: e.target.value })} />
                      <div className="mt-2">
                        <Textarea rows={3} placeholder="Текст абзаца" value={b.text} onChange={(e) => patchBlock(i, bi, { text: e.target.value })} />
                      </div>
                      <div className="mt-2 text-right">
                        <Btn type="button" variant="ghost" onClick={() => patch(i, { body: p.body.filter((_, k) => k !== bi) })}>Удалить блок</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Btn type="button" onClick={() => save(i)} disabled={busyId === (p.id ?? `new-${i}`)}>
                  {busyId === (p.id ?? `new-${i}`) ? 'Сохранение…' : 'Сохранить статью'}
                </Btn>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
