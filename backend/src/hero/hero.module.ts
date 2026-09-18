import { Module } from '@nestjs/common';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { AdminHeroController } from './admin-hero.controller';

@Module({
  controllers: [HeroController, AdminHeroController],
  providers: [HeroService],
})
export class HeroModule {}
