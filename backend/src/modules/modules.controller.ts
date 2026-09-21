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
import { ModulesService } from './modules.service';
import {
  CreateModuleDto,
  UpdateModuleDto,
  ReorderModulesDto,
} from './dto/module.dto';
import { ModuleStatus } from '@prisma/client';
import { RequirePermissions, CurrentUser, AuthenticatedUser } from '../common/decorators';

@ApiTags('Admin/Modules')
@Controller('admin/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @RequirePermissions('modules.read')
  @ApiOperation({ summary: 'List modules with search, filtering, and pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', enum: ModuleStatus, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAdminModules(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: ModuleStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.modulesService.getAdminModules({
      search,
      category,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get(':id')
  @RequirePermissions('modules.read')
  @ApiOperation({ summary: 'Get complete module details for admin editing' })
  async getAdminModuleById(@Param('id') id: string) {
    return this.modulesService.getAdminModuleById(id);
  }

  @Get(':id/preview')
  @RequirePermissions('modules.read')
  @ApiOperation({ summary: 'Get sandboxed draft data for admin preview' })
  async getAdminModulePreview(@Param('id') id: string) {
    return this.modulesService.getAdminModulePreview(id);
  }

  @Post()
  @RequirePermissions('modules.write')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new module draft' })
  async createModule(
    @Body() dto: CreateModuleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.createModule(dto, user?.id);
  }

  @Patch(':id')
  @RequirePermissions('modules.write')
  @ApiOperation({ summary: 'Save draft updates with optimistic version checking' })
  async updateModule(
    @Param('id') id: string,
    @Body() dto: UpdateModuleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.updateModule(id, dto, user?.id);
  }

  @Post(':id/publish')
  @RequirePermissions('modules.publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate and transition module status to PUBLISHED' })
  async publishModule(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.publishModule(id, user?.id);
  }

  @Post(':id/unpublish')
  @RequirePermissions('modules.publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition module status from PUBLISHED to DRAFT' })
  async unpublishModule(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.unpublishModule(id, user?.id);
  }

  @Post(':id/archive')
  @RequirePermissions('modules.archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transition module status to ARCHIVED' })
  async archiveModule(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.archiveModule(id, user?.id);
  }

  @Post(':id/restore')
  @RequirePermissions('modules.archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived module back to DRAFT' })
  async restoreModule(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.restoreModule(id, user?.id);
  }

  @Post('reorder')
  @RequirePermissions('modules.reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transactionally update sort orders for modules' })
  async reorderModules(
    @Body() dto: ReorderModulesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.reorderModules(dto, user?.id);
  }

  @Delete(':id')
  @RequirePermissions('modules.archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete an unpublished draft with 0 references' })
  async deleteModule(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.modulesService.deleteModule(id, user?.id);
  }
}
