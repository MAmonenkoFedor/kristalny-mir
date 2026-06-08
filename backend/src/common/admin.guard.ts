import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/**
 * Простой guard для админ-эндпоинтов.
 * Проверяет заголовок `x-admin-token` против ADMIN_TOKEN из окружения.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header('x-admin-token');
    const expected = process.env.ADMIN_TOKEN;

    if (!expected) {
      throw new UnauthorizedException('ADMIN_TOKEN не настроен на сервере');
    }
    if (!token || token !== expected) {
      throw new UnauthorizedException('Неверный админ-токен');
    }
    return true;
  }
}
