import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SiteSettingsDto } from './dto/site-settings.dto';

@Injectable()
export class SiteSettingsService {
  private readonly logger = new Logger(SiteSettingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  getDefaultSettings(): Record<string, string> {
    return {
      siteName: 'Bizonix',
      companyName: 'Fibonce Tech Solutions Pvt. Ltd.',
      tagline: 'Business and Operations, Smarter Together',
      description:
        'An enterprise ERP built for Indian brands running wholesale, retail, and franchise operations together.',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      locale: 'en-IN',
      addressCity: 'Bangalore',
      addressState: 'Karnataka',
      addressCountry: 'India',
      addressPostal: '560001',

      salesEmail: 'sales@bizonix.in',
      supportEmail: 'support@bizonix.in',
      salesPhone: '+91 98765 43210',
      whatsappNumber: '919876543210',
      whatsappUrl: 'https://wa.me/919876543210',
      officeLocation: 'Bangalore, India',

      publicSiteUrl: 'http://localhost:3000',
      tenantPortalUrl: 'https://app.bizonix.in',
      calendlyUrl: '',
      brochureUrl: '/brochure-coming-soon',
      googleAnalyticsId: '',
      googleTagManagerId: '',
      metaPixelId: '',

      maxLoginAttempts: '5',
      lockoutDurationMinutes: '15',
      sessionTimeoutMinutes: '60',
      enforceStrongPassword: 'true',
      forcePasswordChangeFirstLogin: 'false',

      leadNotificationEmails: 'admin@bizonix.com',
      autoReplyLeadEmail: 'true',

      maintenanceMode: 'false',
      maintenanceMessage:
        'Bizonix platform is undergoing scheduled maintenance. Please check back shortly.',
    };
  }

  async getSettings(): Promise<SiteSettingsDto> {
    const records = await this.prisma.siteSetting.findMany();
    const map = new Map<string, string>();
    for (const r of records) {
      map.set(r.key, r.value);
    }

    const defaults = this.getDefaultSettings();
    const getVal = (key: string): string => map.get(key) ?? defaults[key] ?? '';
    const getBool = (key: string): boolean => {
      const v = map.get(key) ?? defaults[key];
      return v === 'true';
    };

    return {
      siteName: getVal('siteName'),
      companyName: getVal('companyName'),
      tagline: getVal('tagline'),
      description: getVal('description'),
      currency: getVal('currency'),
      timezone: getVal('timezone'),
      locale: getVal('locale'),
      addressCity: getVal('addressCity'),
      addressState: getVal('addressState'),
      addressCountry: getVal('addressCountry'),
      addressPostal: getVal('addressPostal'),

      salesEmail: getVal('salesEmail'),
      supportEmail: getVal('supportEmail'),
      salesPhone: getVal('salesPhone'),
      whatsappNumber: getVal('whatsappNumber'),
      whatsappUrl: getVal('whatsappUrl'),
      officeLocation: getVal('officeLocation'),

      publicSiteUrl: getVal('publicSiteUrl'),
      tenantPortalUrl: getVal('tenantPortalUrl'),
      calendlyUrl: getVal('calendlyUrl'),
      brochureUrl: getVal('brochureUrl'),
      googleAnalyticsId: getVal('googleAnalyticsId'),
      googleTagManagerId: getVal('googleTagManagerId'),
      metaPixelId: getVal('metaPixelId'),

      maxLoginAttempts: getVal('maxLoginAttempts'),
      lockoutDurationMinutes: getVal('lockoutDurationMinutes'),
      sessionTimeoutMinutes: getVal('sessionTimeoutMinutes'),
      enforceStrongPassword: getBool('enforceStrongPassword'),
      forcePasswordChangeFirstLogin: getBool('forcePasswordChangeFirstLogin'),

      leadNotificationEmails: getVal('leadNotificationEmails'),
      autoReplyLeadEmail: getBool('autoReplyLeadEmail'),

      maintenanceMode: getBool('maintenanceMode'),
      maintenanceMessage: getVal('maintenanceMessage'),
    };
  }

  async updateSettings(dto: SiteSettingsDto, userId?: string): Promise<{ success: boolean }> {
    const entries = Object.entries(dto);

    for (const [key, val] of entries) {
      if (val === undefined || val === null) continue;
      const strVal = typeof val === 'boolean' ? (val ? 'true' : 'false') : String(val);

      await this.prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: strVal, type: typeof val },
        update: { value: strVal, type: typeof val },
      });
    }

    if (userId) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'SITE_SETTINGS_UPDATED',
            resourceType: 'SETTINGS',
            resourceId: 'global',
            actorUserId: userId,
            afterJson: { updatedKeys: Object.keys(dto) },
          },
        })
        .catch((err) => this.logger.warn('Failed to audit site settings update', err));
    }

    return { success: true };
  }

  async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      siteName: settings.siteName,
      companyName: settings.companyName,
      tagline: settings.tagline,
      description: settings.description,
      currency: settings.currency,
      locale: settings.locale,
      salesEmail: settings.salesEmail,
      salesPhone: settings.salesPhone,
      whatsappUrl: settings.whatsappUrl,
      officeLocation: settings.officeLocation,
      calendlyUrl: settings.calendlyUrl,
      brochureUrl: settings.brochureUrl,
      googleAnalyticsId: settings.googleAnalyticsId,
      googleTagManagerId: settings.googleTagManagerId,
      metaPixelId: settings.metaPixelId,
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
    };
  }

  async getDiagnostics() {
    const start = Date.now();
    let dbStatus = 'CONNECTED';
    let dbLatencyMs = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - start;
    } catch (err: any) {
      dbStatus = 'ERROR';
      dbLatencyMs = -1;
    }

    const mem = process.memoryUsage();
    const activeSessionsCount = await this.prisma.refreshSession.count({
      where: { expiresAt: { gt: new Date() } },
    });

    return {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        provider: 'PostgreSQL 16',
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptimeSeconds: Math.round(process.uptime()),
        memory: {
          heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
          rssMb: Math.round(mem.rss / 1024 / 1024),
        },
      },
      security: {
        activeSessions: activeSessionsCount,
      },
      email: {
        isConfigured: this.emailService.isConfigured,
      },
    };
  }

  async revokeAllSessions(userId?: string): Promise<{ count: number }> {
    const res = await this.prisma.refreshSession.deleteMany({});
    if (userId) {
      await this.prisma.auditLog
        .create({
          data: {
            action: 'ALL_SESSIONS_REVOKED',
            resourceType: 'SECURITY',
            resourceId: 'sessions',
            actorUserId: userId,
            afterJson: { deletedCount: res.count },
          },
        })
        .catch((err) => this.logger.warn('Failed to audit session revocation', err));
    }
    return { count: res.count };
  }

  async sendTestEmail(to: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await this.emailService.send({
        to,
        subject: 'Bizonix Platform — Test Verification Email',
        text: `This is a verification test email from the Bizonix Admin Console sent on ${new Date().toISOString()}. Your email delivery integration is functioning properly.`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #1e293b;">
            <h2 style="color: #2563eb;">Bizonix Platform Test Email</h2>
            <p>Your email notification delivery service is successfully configured and active.</p>
            <p style="font-size: 12px; color: #64748b;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        `,
      });

      if (!res.configured) {
        return {
          success: false,
          message: 'Email service is not configured with valid delivery credentials.',
        };
      }

      return { success: true, message: 'Test email successfully dispatched!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to dispatch test email.' };
    }
  }
}
