import {
  apiUrl,
  defaultSite,
  defaultServices,
  defaultGallery,
  defaultPosts,
  type SiteConfig,
  type ServiceItem,
  type GalleryItem,
  type PostItem,
} from './defaults';

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${apiUrl}${path}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data === null || data === undefined) return fallback;
    return data as T;
  } catch {
    return fallback;
  }
}

export async function getSite(): Promise<SiteConfig> {
  const site = await fetchJson<SiteConfig | null>('/content/site', null);
  // мягкое слияние с дефолтами, чтобы новые поля не ломали рендер
  return site ? { ...defaultSite, ...site, hero: { ...defaultSite.hero, ...site.hero } } : defaultSite;
}

export function getServices(): Promise<ServiceItem[]> {
  return fetchJson<ServiceItem[]>('/content/services', defaultServices);
}

export function getGallery(): Promise<GalleryItem[]> {
  return fetchJson<GalleryItem[]>('/content/gallery', defaultGallery);
}

export function getPosts(): Promise<PostItem[]> {
  return fetchJson<PostItem[]>('/content/posts', defaultPosts);
}

export async function getPost(slug: string): Promise<PostItem | null> {
  try {
    const res = await fetch(`${apiUrl}/content/posts/${slug}`, { cache: 'no-store' });
    if (res.ok) return (await res.json()) as PostItem;
  } catch {
    /* ignore, fall back to defaults */
  }
  return defaultPosts.find((p) => p.slug === slug) ?? null;
}

export { mediaUrl } from './defaults';
