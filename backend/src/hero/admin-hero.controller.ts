import { Controller, Get, Post, Patch, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { HeroService } from './hero.service';
import { RequirePermissions, CurrentUser, AuthenticatedUser } from '../common/decorators';

@ApiTags('Admin/Hero')
@Controller('admin/hero')
export class AdminHeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  @RequirePermissions('hero.read')
  @ApiOperation({ summary: 'List all hero variants and publish state' })
  async getHeroDashboard() {
    const variants = await this.heroService.getAllVariants();
    const publishState = await this.heroService.getPublishState();
    return { variants, publishState };
  }

  @Get(':id')
  @RequirePermissions('hero.read')
  @ApiOperation({ summary: 'Get a specific hero variant' })
  getVariant(@Param('id') id: string) {
    return this.heroService.getVariant(id);
  }

  @Get(':id/preview')
  @RequirePermissions('hero.preview')
  @ApiOperation({ summary: 'Preview a hero variant via admin GET' })
  previewGet(@Param('id') id: string) {
    return this.heroService.getVariant(id);
  }

  @Post(':id/preview')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('hero.preview')
  @ApiOperation({ summary: 'Preview a hero variant' })
  preview(@Param('id') id: string) {
    // Simply returns the variant so frontend can preview it
    return this.heroService.getVariant(id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('hero.publish')
  @ApiOperation({ summary: 'Publish a hero variant' })
  publish(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    const ip = request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';
    return this.heroService.publish(id, user.id, ip, userAgent);
  }

  @Post(':id/draft')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('hero.write')
  @ApiOperation({ summary: 'Set a hero variant as the current draft' })
  setDraft(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    const ip = request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';
    return this.heroService.setDraft(id, user.id, ip, userAgent);
  }

  @Patch(':id/archive')
  @RequirePermissions('hero.write')
  @ApiOperation({ summary: 'Archive a hero variant' })
  archive(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
  ) {
    const ip = request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';
    return this.heroService.archive(id, user.id, ip, userAgent);
  }
}
