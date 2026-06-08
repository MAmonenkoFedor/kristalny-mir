import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || '.png';
          cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`);
        },
      }),
      limits: { fileSize: 8 * 1024 * 1024 }, // 8 МБ
      fileFilter: (_req, file, cb) => {
        const ok = /^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype);
        cb(ok ? null : new BadRequestException('Можно загружать только изображения'), ok);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Файл не получен');
    return { url: `/uploads/${file.filename}`, filename: file.filename };
  }
}
