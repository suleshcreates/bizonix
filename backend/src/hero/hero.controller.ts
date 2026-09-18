import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { Public } from '../common/decorators';

@ApiTags('Public/Hero')
@Controller('public/hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get the currently published hero configuration' })
  getPublishedHeroRoot() {
    return this.heroService.getPublishedHero();
  }

  @Public()
  @Get('current')
  @ApiOperation({ summary: 'Get the currently published hero configuration' })
  getPublishedHero() {
    return this.heroService.getPublishedHero();
  }

  @Public()
  @Get(':id/preview')
  @ApiOperation({ summary: 'Get a specific hero configuration for preview' })
  async getPreview(@Param('id') id: string) {
    const variant = await this.heroService.getVariant(id);
    if (!variant) throw new NotFoundException();
    const configObj = (typeof variant.config === 'object' && variant.config !== null) ? variant.config : {};
    return {
      id: variant.id,
      key: variant.key,
      name: variant.name,
      ...configObj,
      config: variant.config,
    };
  }
}
