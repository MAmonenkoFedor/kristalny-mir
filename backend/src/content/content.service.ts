import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function safeParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

type Dict = Record<string, any>;

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  // ───────────────────────── SITE (singleton JSON) ─────────────────────────
  async getSite(): Promise<Dict | null> {
    const row = await this.prisma.setting.findUnique({ where: { key: 'site' } });
    return row ? safeParse<Dict>(row.json, {}) : null;
  }

  async setSite(data: Dict) {
    const json = JSON.stringify(data ?? {});
    await this.prisma.setting.upsert({
      where: { key: 'site' },
      update: { json },
      create: { key: 'site', json },
    });
    return { ok: true };
  }

  // ───────────────────────── SERVICES ─────────────────────────
  private mapService = (s: any) => ({ ...s, features: safeParse<string[]>(s.features, []) });

  private serviceData(d: Dict) {
    return {
      order: Number(d.order ?? 0),
      icon: String(d.icon ?? 'cleaning'),
      title: String(d.title ?? ''),
      summary: String(d.summary ?? ''),
      long: String(d.long ?? ''),
      price: String(d.price ?? ''),
      features: JSON.stringify(Array.isArray(d.features) ? d.features : []),
    };
  }

  async listServices() {
    const rows = await this.prisma.service.findMany({ orderBy: { order: 'asc' } });
    return rows.map(this.mapService);
  }

  async createService(d: Dict) {
    const s = await this.prisma.service.create({ data: this.serviceData(d) });
    return this.mapService(s);
  }

  async updateService(id: string, d: Dict) {
    await this.ensure(this.prisma.service.findUnique({ where: { id } }));
    const s = await this.prisma.service.update({ where: { id }, data: this.serviceData(d) });
    return this.mapService(s);
  }

  async deleteService(id: string) {
    await this.prisma.service.delete({ where: { id } });
    return { ok: true };
  }

  // ───────────────────────── GALLERY ─────────────────────────
  private galleryData(d: Dict) {
    return {
      order: Number(d.order ?? 0),
      title: String(d.title ?? ''),
      meta: String(d.meta ?? ''),
      category: String(d.category ?? 'Клининг'),
      imageUrl: d.imageUrl ? String(d.imageUrl) : null,
      grad: d.grad ? String(d.grad) : null,
      wide: Boolean(d.wide),
    };
  }

  listGallery() {
    return this.prisma.galleryItem.findMany({ orderBy: { order: 'asc' } });
  }

  createGallery(d: Dict) {
    return this.prisma.galleryItem.create({ data: this.galleryData(d) });
  }

  updateGallery(id: string, d: Dict) {
    return this.prisma.galleryItem.update({ where: { id }, data: this.galleryData(d) });
  }

  async deleteGallery(id: string) {
    await this.prisma.galleryItem.delete({ where: { id } });
    return { ok: true };
  }

  // ───────────────────────── POSTS ─────────────────────────
  private mapPost = (p: any) => ({ ...p, body: safeParse<any[]>(p.body, []) });

  private postData(d: Dict) {
    return {
      slug: String(d.slug ?? '').trim(),
      title: String(d.title ?? ''),
      excerpt: String(d.excerpt ?? ''),
      category: String(d.category ?? 'Клининг'),
      date: String(d.date ?? new Date().toISOString().slice(0, 10)),
      readMinutes: Number(d.readMinutes ?? 4),
      coverUrl: d.coverUrl ? String(d.coverUrl) : null,
      grad: d.grad ? String(d.grad) : null,
      body: JSON.stringify(Array.isArray(d.body) ? d.body : []),
      published: d.published === undefined ? true : Boolean(d.published),
    };
  }

  async listPosts(includeUnpublished = false) {
    const rows = await this.prisma.post.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: { date: 'desc' },
    });
    return rows.map(this.mapPost);
  }

  async getPost(slug: string) {
    const p = await this.prisma.post.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException('Статья не найдена');
    return this.mapPost(p);
  }

  async createPost(d: Dict) {
    const p = await this.prisma.post.create({ data: this.postData(d) });
    return this.mapPost(p);
  }

  async updatePost(id: string, d: Dict) {
    const p = await this.prisma.post.update({ where: { id }, data: this.postData(d) });
    return this.mapPost(p);
  }

  async deletePost(id: string) {
    await this.prisma.post.delete({ where: { id } });
    return { ok: true };
  }

  private async ensure<T>(p: Promise<T | null>): Promise<T> {
    const r = await p;
    if (!r) throw new NotFoundException('Запись не найдена');
    return r;
  }
}
