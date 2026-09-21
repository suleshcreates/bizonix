import { Controller, Get, Param } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Public } from '../common/decorators/public.decorator';
import { ModuleListItemDto, ModulePublicDetailDto } from './dto/module.dto';

@Controller('public/modules')
export class PublicModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Public()
  @Get()
  async getPublicModules(): Promise<ModuleListItemDto[]> {
    return this.modulesService.getPublicModules();
  }

  @Public()
  @Get(':slug')
  async getPublicModuleBySlug(@Param('slug') slug: string): Promise<ModulePublicDetailDto> {
    return this.modulesService.getPublicModuleBySlug(slug);
  }
}
