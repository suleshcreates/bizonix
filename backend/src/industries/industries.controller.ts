import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IndustriesService } from './industries.service';
import {
  CreateIndustryDto,
  UpdateIndustryDto,
  ReorderIndustriesDto,
} from './dto/industry.dto';
import { IndustryStatus } from '@prisma/client';
import { RequirePermissions, CurrentUser, AuthenticatedUser } from '../common/decorators';

@ApiTags('Admin/Industries')
@Controller('admin/industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Get()
  @RequirePermissions('industries.read')
  @ApiOperation({ summary: 'List industries with search, filtering, and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', enum: IndustryStatus, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAdminIndustries(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: IndustryStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.industriesService.getAdminIndustries({
      search,
      category,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get(':id')
  @RequirePermissions('industries.read')
  @ApiOperation({ summary: 'Get complete industry details for admin editing' })
  async getAdminIndustryById(@Param('id') id: string) {
    return this.industriesService.getAdminIndustryById(id);
  }

  @Get(':id/preview')
  @RequirePermissions('industries.read')
  @ApiOperation({ summary: 'Get sandboxed draft data for admin preview' })
  async getAdminIndustryPreview(@Param('id') id: string) {
    return this.industriesService.getAdminIndustryPreview(id);
  }

  @Post()
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new industry draft' })
  async createIndustry(
    @Body() dto: CreateIndustryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.createIndustry(dto, user?.id);
  }

  @Patch(':id')
  @RequirePermissions('industries.write')
  @ApiOperation({ summary: 'Save draft updates with optimistic version checking' })
  async updateIndustry(
    @Param('id') id: string,
    @Body() dto: UpdateIndustryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.updateIndustry(id, dto, user?.id);
  }

  @Post(':id/publish')
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate and transition industry status to PUBLISHED' })
  async publishIndustry(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.publishIndustry(id, user?.id);
  }

  @Post(':id/unpublish')
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition industry status from PUBLISHED to DRAFT' })
  async unpublishIndustry(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.unpublishIndustry(id, user?.id);
  }

  @Post(':id/archive')
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition industry status to ARCHIVED' })
  async archiveIndustry(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.archiveIndustry(id, user?.id);
  }

  @Post(':id/restore')
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived industry back to DRAFT' })
  async restoreIndustry(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.restoreIndustry(id, user?.id);
  }

  @Post('reorder')
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transactionally update sort orders for industries' })
  async reorderIndustries(
    @Body() dto: ReorderIndustriesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.reorderIndustries(dto, user?.id);
  }

  @Delete(':id')
  @RequirePermissions('industries.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete an unpublished draft with 0 references' })
  async deleteIndustry(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.industriesService.deleteIndustry(id, user?.id);
  }
}
