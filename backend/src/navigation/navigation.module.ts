import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { PublicNavigationController } from './public-navigation.controller';

@Module({
  imports: [PrismaModule],
  controllers: [NavigationController, PublicNavigationController],
  providers: [NavigationService],
  exports: [NavigationService],
})
export class NavigationModule {}
