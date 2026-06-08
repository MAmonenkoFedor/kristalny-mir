import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const Icon = {
  home: (p: IconProps) => (
    <svg {...base} {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></svg>
  ),
  building: (p: IconProps) => (
    <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" /><path d="M10 21v-3h4v3" /></svg>
  ),
  sparkles: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 3l1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3Z" /><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></svg>
  ),
  window: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="1.5" /><path d="M12 3.5v17M3.5 12h17" /></svg>
  ),
  sofa: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 11V8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V11" /><path d="M3 13a2 2 0 0 1 2-2 2 2 0 0 1 2 2v3h10v-3a2 2 0 0 1 4 0v5H3v-5Z" /><path d="M6 18v1.5M18 18v1.5" /></svg>
  ),
  construction: (p: IconProps) => (
    <svg {...base} {...p}><path d="M3 21h18" /><path d="M5 21V10l7-4 7 4v11" /><path d="M9 21v-5h6v5" /><path d="M12 3v3" /></svg>
  ),
  clipboard: (p: IconProps) => (
    <svg {...base} {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4a3 3 0 0 1 6 0" /><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" /></svg>
  ),
  doc: (p: IconProps) => (
    <svg {...base} {...p}><path d="M6 3h7l5 5v13H6z" /><path d="M13 3v5h5" /><path d="M9 13h6M9 16.5h6" /></svg>
  ),
  chart: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 4v16h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></svg>
  ),
  box: (p: IconProps) => (
    <svg {...base} {...p}><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></svg>
  ),
  check: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 12.5 9 17.5 20 6.5" /></svg>
  ),
  arrow: (p: IconProps) => (
    <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  phone: (p: IconProps) => (
    <svg {...base} {...p}><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" /></svg>
  ),
  mail: (p: IconProps) => (
    <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
  ),
  pin: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
  ),
  clock: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg>
  ),
  shield: (p: IconProps) => (
    <svg {...base} {...p}><path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  leaf: (p: IconProps) => (
    <svg {...base} {...p}><path d="M5 19C4 12 8 5 19 5c0 11-7 15-14 14Z" /><path d="M5 19c3-5 6-7 10-8" /></svg>
  ),
  star: (p: IconProps) => (
    <svg {...base} {...p} fill="currentColor" stroke="none"><path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" /></svg>
  ),
  users: (p: IconProps) => (
    <svg {...base} {...p}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a5.5 5.5 0 0 0-4-5.3" /></svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
  ),
};

export const iconMap = {
  cleaning: Icon.sparkles,
  inventory: Icon.clipboard,
  staff: Icon.users,
};
