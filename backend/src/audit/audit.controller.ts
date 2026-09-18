import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuditService, AuditQuery } from './audit.service';
import { RequirePermissions } from '../common/decorators';

@ApiTags('Admin/Audit')
@Controller('admin/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions('audit.read')
  @ApiOperation({ summary: 'Get paginated audit logs with filtering and search' })
  @ApiQuery({ name: 'page',         required: false })
  @ApiQuery({ name: 'limit',        required: false })
  @ApiQuery({ name: 'action',       required: false })
  @ApiQuery({ name: 'resourceType', required: false })
  @ApiQuery({ name: 'actorUserId',  required: false })
  @ApiQuery({ name: 'search',       required: false })
  @ApiQuery({ name: 'dateFrom',     required: false })
  @ApiQuery({ name: 'dateTo',       required: false })
  findAll(@Query() query: AuditQuery) {
    return this.auditService.findAll(query);
  }

  @Get('stats')
  @RequirePermissions('audit.read')
  @ApiOperation({ summary: 'Get audit log statistics — action counts, resource types, recent actors' })
  getStats() {
    return this.auditService.getStats();
  }
}
