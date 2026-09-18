import { EnquiriesModule } from './enquiries/enquiries.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuditModule } from './audit/audit.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { HeroModule } from './hero/hero.module';
import { NavigationModule } from './navigation/navigation.module';
import { PricingModule } from './pricing/pricing.module';
import { ModulesModule } from './modules/modules.module';
import { IndustriesModule } from './industries/industries.module';
import { CustomersModule } from './customers/customers.module';
import { PartnersModule } from './partners/partners.module';
import { FaqsModule } from './faqs/faqs.module';
import { SeoModule } from './seo/seo.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    SiteSettingsModule,
    HeroModule,
    NavigationModule,
    PricingModule,
    ModulesModule,
    IndustriesModule,
    CustomersModule,
    PartnersModule,
    FaqsModule,
    SeoModule,
    EmailModule,
    EnquiriesModule,
    DashboardModule,
  ],
})
export class AppModule {}
