import { Controller, Get, Param } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { Public } from '../common/decorators/public.decorator';
import { IndustryListItemDto, IndustryPublicDetailDto } from './dto/industry.dto';

@Controller('public/industries')
export class PublicIndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Public()
  @Get()
  async getPublicIndustries(): Promise<IndustryListItemDto[]> {
    return this.industriesService.getPublicIndustries();
  }

  @Public()
  @Get(':slug')
  async getPublicIndustryBySlug(@Param('slug') slug: string): Promise<IndustryPublicDetailDto> {
    return this.industriesService.getPublicIndustryBySlug(slug);
  }
}
