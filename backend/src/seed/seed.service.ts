import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import {
  defaultSite,
  defaultServices,
  defaultGallery,
  defaultPosts,
} from './seed-data';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedContent();
  }

  private async seedAdmin() {
    const email = (process.env.ADMIN_EMAIL ?? 'admin@kristalnymir.by')
      .toLowerCase()
      .trim();
    const password = process.env.ADMIN_PASSWORD ?? 'change-me-please';

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await this.prisma.user.create({ data: { email, passwordHash } });
      this.logger.log(`Создан администратор: ${email}`);
    }
  }

  private async seedContent() {
    const site = await this.prisma.setting.findUnique({ where: { key: 'site' } });
    if (!site) {
      await this.prisma.setting.create({
        data: { key: 'site', json: JSON.stringify(defaultSite) },
      });
      this.logger.log('Засеяны настройки сайта');
    }

    if ((await this.prisma.service.count()) === 0) {
      for (const s of defaultServices) {
        await this.prisma.service.create({
          data: { ...s, features: JSON.stringify(s.features) },
        });
      }
      this.logger.log('Засеяны услуги');
    }

    if ((await this.prisma.galleryItem.count()) === 0) {
      for (const g of defaultGallery) {
        await this.prisma.galleryItem.create({ data: g });
      }
      this.logger.log('Засеяна галерея');
    }

    if ((await this.prisma.post.count()) === 0) {
      for (const p of defaultPosts) {
        await this.prisma.post.create({
          data: { ...p, body: JSON.stringify(p.body) },
        });
      }
      this.logger.log('Засеяны статьи блога');
    }
  }
}
