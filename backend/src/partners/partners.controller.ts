import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  ReorderPartnersDto,
  PartnersConfigDto,
} from './dto/partner.dto';
import { Public, CurrentUser, AuthenticatedUser, RequirePermissions } from '../common/decorators';

@ApiTags('Partners')
@Controller()
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  // --------------------------------------------------------------------------
  // Public Storefront Endpoint
  // --------------------------------------------------------------------------
  @Public()
  @Get('public/partners')
  @ApiOperation({ summary: 'Get published partners and section configuration for storefront' })
  async getPublicPartners() {
    return this.partnersService.findAllPublic();
  }

  // --------------------------------------------------------------------------
  // Admin CMS Endpoints
  // --------------------------------------------------------------------------
  @Get(['admin/partners', 'partners'])
  @RequirePermissions('partners.read')
  @ApiOperation({ summary: 'List all partners with search and sort order for admin CMS' })
  async getAdminPartners(@Query('search') search?: string) {
    return this.partnersService.findAllAdmin(search);
  }

  @Post(['admin/partners', 'partners'])
  @RequirePermissions('partners.write')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new partner entry' })
  async createPartner(
    @Body() dto: CreatePartnerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.partnersService.create(dto, user.id);
  }

  @Patch(['admin/partners/:id', 'partners/:id'])
  @RequirePermissions('partners.write')
  @ApiOperation({ summary: 'Update partner entry' })
  async updatePartner(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.partnersService.update(id, dto, user.id);
  }

  @Delete(['admin/partners/:id', 'partners/:id'])
  @RequirePermissions('partners.write')
  @ApiOperation({ summary: 'Delete partner entry' })
  async deletePartner(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.partnersService.delete(id, user.id);
  }

  @Post(['admin/partners/reorder', 'partners/reorder'])
  @RequirePermissions('partners.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Batch reorder partner sequence' })
  async reorderPartners(
    @Body() dto: ReorderPartnersDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.partnersService.reorder(dto.ids, user.id);
  }

  @Get(['admin/partners/config', 'partners/config'])
  @RequirePermissions('partners.read')
  @ApiOperation({ summary: 'Get section header configuration' })
  async getConfig() {
    return this.partnersService.getConfig();
  }

  @Put(['admin/partners/config', 'partners/config'])
  @RequirePermissions('partners.write')
  @ApiOperation({ summary: 'Update section header configuration' })
  async updateConfig(
    @Body() dto: PartnersConfigDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.partnersService.updateConfig(dto, user.id);
  }

  @Post(['admin/partners/config', 'partners/config'])
  @RequirePermissions('partners.write')
  @ApiOperation({ summary: 'Update section header configuration (POST alias)' })
  async updateConfigPost(
    @Body() dto: PartnersConfigDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.partnersService.updateConfig(dto, user.id);
  }
}
