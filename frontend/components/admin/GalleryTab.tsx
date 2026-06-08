'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/adminClient';
import type { GalleryItem } from '@/lib/defaults';
import { Field, Input, Select, Btn, Card, ImageUpload, StatusNote } from './ui';

const categories = ['Клининг', 'Инвентаризация', 'Персонал'];

export function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => apiGet<GalleryItem[]>('/content/gallery').then(setItems).catch(() => setStatus({ kind: 'err', text: 'Не удалось загрузить галерею' }));
  useEffect(() => { load(); }, []);

  const patch = (i: number, p: Partial<GalleryItem>) => setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...p } : it)));

  async function save(i: number) {
    const g = items[i];
    setBusyId(g.id ?? `new-${i}`);
    setStatus(null);
    try {
      const saved = g.id
        ? await apiSend<GalleryItem>('PUT', `/admin/content/gallery/${g.id}`, g)
        : await apiSend<GalleryItem>('POST', '/admin/content/gallery', g);
      setItems((prev) => prev.map((it, j) => (j === i ? saved : it)));
      setStatus({ kind: 'ok', text: 'Карточка сохранена' });
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(i: number) {
    const g = items[i];
    if (!confirm('Удалить карточку?')) return;
    try {
      if (g.id) await apiSend('DELETE', `/admin/content/gallery/${g.id}`);
      setItems((prev) => prev.filter((_, j) => j !== i));
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    }
  }

  function add() {
    setItems((prev) => [...prev, { order: prev.length, title: 'Новый проект', meta: '', category: 'Клининг', imageUrl: null, grad: null, wide: false }]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <StatusNote status={status} />
        <Btn type="button" onClick={add}>+ Добавить проект</Btn>
      </div>

      {items.map((g, i) => (
        <Card key={g.id ?? `new-${i}`}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Название"><Input value={g.title} onChange={(e) => patch(i, { title: e.target.value })} /></Field>
            <Field label="Подпись (метаданные)" hint="например: Ежедневный клининг · 3 200 м²"><Input value={g.meta} onChange={(e) => patch(i, { meta: e.target.value })} /></Field>
            <Field label="Категория">
              <Select value={g.category} onChange={(e) => patch(i, { category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Порядок"><Input type="number" value={g.order} onChange={(e) => patch(i, { order: Number(e.target.value) })} /></Field>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ImageUpload label="Изображение (если нет — будет градиент)" value={g.imageUrl} onChange={(url) => patch(i, { imageUrl: url })} />
            <label className="flex items-center gap-3 self-end pb-3">
              <input type="checkbox" checked={g.wide} onChange={(e) => patch(i, { wide: e.target.checked })} className="h-5 w-5 accent-[oklch(0.63_0.13_198)]" />
              <span className="text-sm font-medium text-ink">Широкая карточка (на 2 колонки)</span>
            </label>
          </div>
          <div className="mt-5 flex gap-3">
            <Btn type="button" onClick={() => save(i)} disabled={busyId === (g.id ?? `new-${i}`)}>
              {busyId === (g.id ?? `new-${i}`) ? 'Сохранение…' : 'Сохранить'}
            </Btn>
            <Btn type="button" variant="danger" onClick={() => remove(i)}>Удалить</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}
