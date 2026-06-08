import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  /** Публичный приём заявки с формы сайта */
  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leads.create(dto);
  }

  /** Список заявок для админки (нужен x-admin-token) */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.leads.findAll();
  }

  /** Смена статуса заявки (нужен x-admin-token) */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leads.updateStatus(id, dto);
  }
}
