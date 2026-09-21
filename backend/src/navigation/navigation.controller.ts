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
import { NavigationService } from './navigation.service';
import {
  UpdateNavigationDto,
  AdminNavigationResponseDto,
} from './dto/navigation.dto';
import { RequirePermissions, CurrentUser, AuthenticatedUser } from '../common/decorators';

@ApiTags('Admin/Navigation')
@Controller('admin/navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @RequirePermissions('navigation.read')
  @ApiOperation({ summary: 'Get full navigation configuration for Admin CMS' })
  async getAdminNavigation(): Promise<AdminNavigationResponseDto> {
    return this.navigationService.getAdminNavigation();
  }

  @Put()
  @Post()
  @RequirePermissions('navigation.write')
  @ApiOperation({ summary: 'Save navigation configuration' })
  async updateNavigation(
    @Body() dto: UpdateNavigationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean }> {
    return this.navigationService.updateNavigation(dto, user?.id);
  }

  @Post('reset')
  @RequirePermissions('navigation.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset navigation configuration to canonical defaults' })
  async resetToDefaults(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean }> {
    return this.navigationService.resetToDefaults(user?.id);
  }
}
