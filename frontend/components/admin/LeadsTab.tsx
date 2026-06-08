'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiGet, apiSend } from '@/lib/adminClient';
import { Btn } from './ui';

type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'REJECTED';
type Lead = {
  id: string;
  name: string;
  phone: string;
  service: string | null;
  comment: string | null;
  status: LeadStatus;
  createdAt: string;
};

const statusMeta: Record<LeadStatus, { label: string; cls: string }> = {
  NEW: { label: 'Новая', cls: 'bg-brand-soft text-brand-ink' },
  IN_PROGRESS: { label: 'В работе', cls: 'bg-[oklch(0.95_0.06_85)] text-[oklch(0.45_0.1_70)]' },
  DONE: { label: 'Выполнена', cls: 'bg-[oklch(0.93_0.07_150)] text-[oklch(0.42_0.11_150)]' },
  REJECTED: { label: 'Отклонена', cls: 'bg-[oklch(0.94_0.04_25)] text-[oklch(0.48_0.12_25)]' },
};

export function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setLeads(await apiGet<Lead[]>('/leads'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await apiSend('PATCH', `/leads/${id}`, { status });
    } catch {
      load();
    }
  }

  const counts = leads.reduce<Record<string, number>>((a, l) => {
    a[l.status] = (a[l.status] ?? 0) + 1;
    return a;
  }, {});

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Всего: {leads.length} · Новых: {counts.NEW ?? 0} · В работе: {counts.IN_PROGRESS ?? 0}
        </p>
        <Btn variant="ghost" onClick={load}>Обновить</Btn>
      </div>

      {error && <p className="mb-4 rounded-xl bg-[oklch(0.96_0.04_25)] px-4 py-2.5 text-sm text-[oklch(0.48_0.13_25)]">{error}</p>}

      {loading && leads.length === 0 ? (
        <p className="text-muted">Загрузка…</p>
      ) : leads.length === 0 ? (
        <p className="text-muted">Заявок пока нет.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3.5 font-semibold">Дата</th>
                  <th className="px-5 py-3.5 font-semibold">Клиент</th>
                  <th className="px-5 py-3.5 font-semibold">Услуга</th>
                  <th className="px-5 py-3.5 font-semibold">Комментарий</th>
                  <th className="px-5 py-3.5 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-line align-top last:border-0">
                    <td className="whitespace-nowrap px-5 py-4 text-muted">
                      {new Date(l.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">{l.name}</div>
                      <a href={`tel:${l.phone}`} className="text-brand-strong">{l.phone}</a>
                    </td>
                    <td className="px-5 py-4 text-ink">{l.service ?? '—'}</td>
                    <td className="max-w-[260px] px-5 py-4 text-muted">{l.comment || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta[l.status].cls}`}>
                        {statusMeta[l.status].label}
                      </span>
                      <select
                        value={l.status}
                        onChange={(e) => changeStatus(l.id, e.target.value as LeadStatus)}
                        className="block w-full rounded-lg border border-line bg-bg px-2.5 py-1.5 text-xs text-ink outline-none focus-visible:border-brand"
                      >
                        {(Object.keys(statusMeta) as LeadStatus[]).map((s) => (
                          <option key={s} value={s}>{statusMeta[s].label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
