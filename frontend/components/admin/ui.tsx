'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/lib/adminClient';
import { mediaUrl } from '@/lib/defaults';

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field ${props.className ?? ''}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`field resize-y ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`field ${props.className ?? ''}`} />;
}

export function Btn({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'danger'
        ? 'inline-flex items-center justify-center gap-2 rounded-full border border-[oklch(0.85_0.08_25)] bg-[oklch(0.97_0.03_25)] px-5 py-2.5 text-sm font-semibold text-[oklch(0.5_0.15_25)] transition-transform duration-150 ease-out-quart active:scale-[0.97]'
        : 'btn-ghost';
  const size = variant === 'primary' ? '!px-5 !py-2.5 !text-sm' : '';
  return <button {...props} className={`${base} ${size} ${className}`} />;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 shadow-soft ${className}`}>{children}</div>;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Изображение',
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const preview = mediaUrl(value);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Ошибка загрузки');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface-2">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-muted">нет</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={ref} type="file" accept="image/*" onChange={onPick} className="hidden" />
          <Btn type="button" variant="ghost" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? 'Загрузка…' : 'Загрузить'}
          </Btn>
          {value && (
            <Btn type="button" variant="ghost" onClick={() => onChange(null)}>
              Убрать
            </Btn>
          )}
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-[oklch(0.5_0.15_25)]">{err}</p>}
    </div>
  );
}

export function StatusNote({ status }: { status: { kind: 'ok' | 'err'; text: string } | null }) {
  if (!status) return null;
  return (
    <p
      className={`rounded-xl px-4 py-2.5 text-sm ${
        status.kind === 'ok'
          ? 'bg-[oklch(0.95_0.06_150)] text-[oklch(0.42_0.11_150)]'
          : 'bg-[oklch(0.96_0.04_25)] text-[oklch(0.48_0.13_25)]'
      }`}
    >
      {status.text}
    </p>
  );
}
