import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

/**
 * Защищает админ-эндпоинты: требует валидный Bearer-токен (JWT).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.header('authorization') ?? '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    try {
      await this.jwt.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException('Сессия истекла, войдите заново');
    }
  }
}
