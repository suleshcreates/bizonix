import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { Public } from '../common/decorators/public.decorator';
import { UpdateNavigationDto } from './dto/navigation.dto';

@ApiTags('Public/Navigation')
@Controller('public/navigation')
export class PublicNavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get active public navigation for website layout' })
  async getPublicNavigation(): Promise<UpdateNavigationDto> {
    return this.navigationService.getPublicNavigation();
  }
}
