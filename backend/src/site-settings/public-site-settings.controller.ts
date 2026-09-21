import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Public/Settings')
@Controller('public/settings')
export class PublicSiteSettingsController {
  constructor(private readonly settingsService: SiteSettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get public site settings' })
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }
}
