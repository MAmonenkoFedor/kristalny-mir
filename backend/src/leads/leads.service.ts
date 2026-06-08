import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({ data: dto });
    this.logger.log(`Новая заявка #${lead.id} от ${lead.name} (${lead.phone})`);

    // Уведомления на email и в Telegram — в фоне, без задержки ответа формы.
    void this.notifications.notifyNewLead(lead);

    return { ok: true, id: lead.id };
  }

  findAll() {
    return this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, dto: UpdateLeadDto) {
    const exists = await this.prisma.lead.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Заявка не найдена');
    }
    return this.prisma.lead.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
