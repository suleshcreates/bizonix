import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class SiteSettingsDto {
  // Identity
  @IsString()
  @IsOptional()
  siteName?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  locale?: string;

  @IsString()
  @IsOptional()
  addressCity?: string;

  @IsString()
  @IsOptional()
  addressState?: string;

  @IsString()
  @IsOptional()
  addressCountry?: string;

  @IsString()
  @IsOptional()
  addressPostal?: string;

  // Contact
  @IsString()
  @IsOptional()
  salesEmail?: string;

  @IsString()
  @IsOptional()
  supportEmail?: string;

  @IsString()
  @IsOptional()
  salesPhone?: string;

  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @IsString()
  @IsOptional()
  whatsappUrl?: string;

  @IsString()
  @IsOptional()
  officeLocation?: string;

  // Integrations & Tracking
  @IsString()
  @IsOptional()
  publicSiteUrl?: string;

  @IsString()
  @IsOptional()
  tenantPortalUrl?: string;

  @IsString()
  @IsOptional()
  calendlyUrl?: string;

  @IsString()
  @IsOptional()
  brochureUrl?: string;

  @IsString()
  @IsOptional()
  googleAnalyticsId?: string;

  @IsString()
  @IsOptional()
  googleTagManagerId?: string;

  @IsString()
  @IsOptional()
  metaPixelId?: string;

  // Security Policy
  @IsString()
  @IsOptional()
  maxLoginAttempts?: string;

  @IsString()
  @IsOptional()
  lockoutDurationMinutes?: string;

  @IsString()
  @IsOptional()
  sessionTimeoutMinutes?: string;

  @IsBoolean()
  @IsOptional()
  enforceStrongPassword?: boolean;

  @IsBoolean()
  @IsOptional()
  forcePasswordChangeFirstLogin?: boolean;

  // Notifications
  @IsString()
  @IsOptional()
  leadNotificationEmails?: string;

  @IsBoolean()
  @IsOptional()
  autoReplyLeadEmail?: boolean;

  // Maintenance
  @IsBoolean()
  @IsOptional()
  maintenanceMode?: boolean;

  @IsString()
  @IsOptional()
  maintenanceMessage?: string;
}

export class TestEmailDto {
  @IsEmail()
  recipientEmail!: string;
}
