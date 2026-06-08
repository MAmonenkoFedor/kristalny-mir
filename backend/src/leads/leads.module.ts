import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadsSummaryService } from './leads-summary.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [LeadsController],
  providers: [LeadsService, LeadsSummaryService],
})
export class LeadsModule {}
