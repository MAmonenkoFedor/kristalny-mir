import { IsEnum } from 'class-validator';
import { LeadStatus } from '@prisma/client';

export class UpdateLeadDto {
  @IsEnum(LeadStatus, {
    message: 'status должен быть одним из: NEW, IN_PROGRESS, DONE, REJECTED',
  })
  status!: LeadStatus;
}
