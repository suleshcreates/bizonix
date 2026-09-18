import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';
import { PublicFaqsController } from './public-faqs.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FaqsController, PublicFaqsController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
