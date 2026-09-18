import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FaqsService } from './faqs.service';
import { Public } from '../common/decorators';
import { FaqLocation } from '@prisma/client';

@ApiTags('Public/FAQs')
@Controller('public/faqs')
export class PublicFaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get published FAQs with categories by location (HOME or BOOK_DEMO)' })
  @ApiQuery({ name: 'location', enum: FaqLocation, required: false })
  getPublicFaqs(@Query('location') location?: FaqLocation) {
    return this.faqsService.getPublicFaqs(location);
  }

  @Public()
  @Get('home')
  @ApiOperation({ summary: 'Get published categorized FAQs for homepage' })
  getHomeFaqs() {
    return this.faqsService.getPublicFaqs(FaqLocation.HOME);
  }

  @Public()
  @Get('book-demo')
  @ApiOperation({ summary: 'Get published FAQs for book demo / contact page' })
  getBookDemoFaqs() {
    return this.faqsService.getPublicFaqs(FaqLocation.BOOK_DEMO);
  }
}
