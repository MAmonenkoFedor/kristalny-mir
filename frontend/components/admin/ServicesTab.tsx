'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/adminClient';
import type { ServiceItem, ServiceIcon } from '@/lib/defaults';
import { Field, Input, Textarea, Select, Btn, Card, StatusNote } from './ui';

const iconOptions: { value: ServiceIcon; label: string }[] = [
  { value: 'cleaning', label: 'Клининг (искра)' },
  { value: 'inventory', label: 'Инвентаризация (планшет)' },
  { value: 'staff', label: 'Персонал (люди)' },
];

export function ServicesTab() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => apiGet<ServiceItem[]>('/content/services').then(setItems).catch(() => setStatus({ kind: 'err', text: 'Не удалось загрузить услуги' }));
  useEffect(() => { load(); }, []);

  const patch = (i: number, p: Partial<ServiceItem>) => setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...p } : it)));

  async function save(i: number) {
    const s = items[i];
    setBusyId(s.id ?? `new-${i}`);
    setStatus(null);
    try {
      const payload = { ...s, features: s.features.filter((f) => f.trim()) };
      const saved = s.id
        ? await apiSend<ServiceItem>('PUT', `/admin/content/services/${s.id}`, payload)
        : await apiSend<ServiceItem>('POST', '/admin/content/services', payload);
      setItems((prev) => prev.map((it, j) => (j === i ? saved : it)));
      setStatus({ kind: 'ok', text: 'Услуга сохранена' });
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(i: number) {
    const s = items[i];
    if (!confirm('Удалить услугу?')) return;
    try {
      if (s.id) await apiSend('DELETE', `/admin/content/services/${s.id}`);
      setItems((prev) => prev.filter((_, j) => j !== i));
    } catch (e) {
      setStatus({ kind: 'err', text: e instanceof Error ? e.message : 'Ошибка' });
    }
  }

  function add() {
    setItems((prev) => [
      ...prev,
      { order: prev.length, icon: 'cleaning', title: 'Новая услуга', summary: '', long: '', price: 'по запросу', features: [] },
    ]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <StatusNote status={status} />
        <Btn type="button" onClick={add}>+ Добавить услугу</Btn>
      </div>

      {items.map((s, i) => (
        <Card key={s.id ?? `new-${i}`}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Название"><Input value={s.title} onChange={(e) => patch(i, { title: e.target.value })} /></Field>
            <Field label="Цена"><Input value={s.price} onChange={(e) => patch(i, { price: e.target.value })} /></Field>
            <Field label="Иконка">
              <Select value={s.icon} onChange={(e) => patch(i, { icon: e.target.value as ServiceIcon })}>
                {iconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Порядок"><Input type="number" value={s.order} onChange={(e) => patch(i, { order: Number(e.target.value) })} /></Field>
          </div>
          <div className="mt-5 grid gap-5">
            <Field label="Краткое описание (карточка)"><Textarea rows={2} value={s.summary} onChange={(e) => patch(i, { summary: e.target.value })} /></Field>
            <Field label="Подробное описание (страница услуг)"><Textarea rows={3} value={s.long} onChange={(e) => patch(i, { long: e.target.value })} /></Field>
            <Field label="Что входит (по одному пункту в строке)">
              <Textarea rows={3} value={s.features.join('\n')} onChange={(e) => patch(i, { features: e.target.value.split('\n') })} />
            </Field>
          </div>
          <div className="mt-5 flex gap-3">
            <Btn type="button" onClick={() => save(i)} disabled={busyId === (s.id ?? `new-${i}`)}>
              {busyId === (s.id ?? `new-${i}`) ? 'Сохранение…' : 'Сохранить'}
            </Btn>
            <Btn type="button" variant="danger" onClick={() => remove(i)}>Удалить</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}
