import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Liveness check' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('health/ready')
  @Public()
  @ApiOperation({ summary: 'Readiness check — verifies PostgreSQL connectivity' })
  async ready() {
    try {
      const result = await this.prisma.$queryRaw<{ db: string }[]>`SELECT current_database() as db`;
      return {
        status: 'ok',
        database: result[0]?.db,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        database: 'unreachable',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
