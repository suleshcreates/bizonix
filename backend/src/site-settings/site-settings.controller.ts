import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsDto, TestEmailDto } from './dto/site-settings.dto';
import { RequirePermissions, CurrentUser, AuthenticatedUser } from '../common/decorators';

@ApiTags('Admin/Settings')
@Controller('admin/settings')
export class SiteSettingsController {
  constructor(private readonly settingsService: SiteSettingsService) {}

  @Get()
  @RequirePermissions('site.read')
  @ApiOperation({ summary: 'Get all platform settings' })
  async getSettings(): Promise<SiteSettingsDto> {
    return this.settingsService.getSettings();
  }

  @Put()
  @Post()
  @RequirePermissions('site.write')
  @ApiOperation({ summary: 'Save platform settings' })
  async updateSettings(
    @Body() dto: SiteSettingsDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean }> {
    return this.settingsService.updateSettings(dto, user?.id);
  }

  @Get('diagnostics')
  @RequirePermissions('site.read')
  @ApiOperation({ summary: 'Get live system diagnostics, db latency, memory, uptime' })
  async getDiagnostics() {
    return this.settingsService.getDiagnostics();
  }

  @Post('revoke-sessions')
  @RequirePermissions('site.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all active user refresh sessions' })
  async revokeSessions(@CurrentUser() user: AuthenticatedUser) {
    return this.settingsService.revokeAllSessions(user?.id);
  }

  @Post('test-email')
  @RequirePermissions('site.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispatch a test email to verify delivery' })
  async testEmail(@Body() dto: TestEmailDto) {
    return this.settingsService.sendTestEmail(dto.recipientEmail);
  }
}
