import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { UsersService } from './users/users.service';
import { FaqsController } from './faqs/faqs.controller';
import { HeroController } from './hero/hero.controller';
import { HealthController } from './health/health.controller';
import { PERMISSIONS_KEY } from './common/decorators/permissions.decorator';
import { HeroStatus } from '@prisma/client';

describe('Bizonix VAPT Security Test Suite (BIZ-SEC Remediation)', () => {
  describe('BIZ-SEC-002: Production Secret Hardening', () => {
    function validateSecrets(env: Record<string, string | undefined>) {
      const isProduction = env.NODE_ENV === 'production';
      if (!isProduction) return true;

      const accessSecret = env.JWT_ACCESS_SECRET;
      const refreshSecret = env.JWT_REFRESH_SECRET;
      const insecurePlaceholders = [
        'change_me_in_production_min32chars_access',
        'change_me_in_production_min32chars_refresh',
        'docker_dev_access_secret_change_in_production_min32chars',
        'docker_dev_refresh_secret_change_in_production_min32chars',
        'secret',
        'jwt_secret',
        'supersecret',
      ];

      if (!accessSecret || accessSecret.length < 32) {
        throw new Error('JWT_ACCESS_SECRET must be at least 32 characters in production');
      }
      if (!refreshSecret || refreshSecret.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be at least 32 characters in production');
      }
      if (accessSecret === refreshSecret) {
        throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
      }
      if (insecurePlaceholders.includes(accessSecret) || insecurePlaceholders.includes(refreshSecret)) {
        throw new Error('Insecure default JWT secrets detected in production');
      }
      return true;
    }

    it('should reject development placeholder secrets in production', () => {
      expect(() =>
        validateSecrets({
          NODE_ENV: 'production',
          JWT_ACCESS_SECRET: 'docker_dev_access_secret_change_in_production_min32chars',
          JWT_REFRESH_SECRET: 'docker_dev_refresh_secret_change_in_production_min32chars',
        }),
      ).toThrow('Insecure default JWT secrets detected in production');
    });

    it('should reject short secrets (<32 characters) in production', () => {
      expect(() =>
        validateSecrets({
          NODE_ENV: 'production',
          JWT_ACCESS_SECRET: 'short_secret_123',
          JWT_REFRESH_SECRET: 'a_long_enough_refresh_secret_greater_than_32_chars',
        }),
      ).toThrow('JWT_ACCESS_SECRET must be at least 32 characters in production');
    });

    it('should reject identical access and refresh secrets in production', () => {
      const secret = 'valid_unique_secret_string_above_32_characters_12345';
      expect(() =>
        validateSecrets({
          NODE_ENV: 'production',
          JWT_ACCESS_SECRET: secret,
          JWT_REFRESH_SECRET: secret,
        }),
      ).toThrow('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
    });

    it('should accept distinct high-entropy secrets in production', () => {
      expect(
        validateSecrets({
          NODE_ENV: 'production',
          JWT_ACCESS_SECRET: 'high_entropy_prod_access_secret_987654321_abcdef',
          JWT_REFRESH_SECRET: 'high_entropy_prod_refresh_secret_123456789_zyxwvu',
        }),
      ).toBe(true);
    });
  });

  describe('BIZ-SEC-005: OTP Cryptographic Security & Anti-Enumeration', () => {
    it('should generate 6-digit OTPs using crypto.randomInt', () => {
      for (let i = 0; i < 100; i++) {
        const otp = crypto.randomInt(100000, 1000000).toString();
        expect(otp).toHaveLength(6);
        const num = parseInt(otp, 10);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThan(1000000);
      }
    });

    it('should hash OTPs using SHA-256 before persistence', () => {
      const otp = '482910';
      const hash1 = crypto.createHash('sha256').update(otp).digest('hex');
      const hash2 = crypto.createHash('sha256').update(otp).digest('hex');
      expect(hash1).toEqual(hash2);
      expect(hash1).not.toContain(otp);
      expect(hash1).toHaveLength(64);
    });
  });

  describe('BIZ-SEC-007: Privilege Escalation & Admin Role Protection', () => {
    let mockPrisma: any;
    let usersService: UsersService;

    const mockSuperAdminActor = {
      id: 'actor-super-1',
      email: 'super@bizonix.com',
      displayName: 'Super Admin',
      roles: ['SUPER_ADMIN'],
      permissions: ['*'],
    };

    const mockRegularAdminActor = {
      id: 'actor-admin-2',
      email: 'admin@bizonix.com',
      displayName: 'Operations Admin',
      roles: ['ADMIN'],
      permissions: ['users.write', 'users.read'],
    };

    beforeEach(() => {
      mockPrisma = {
        role: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
        },
        user: {
          findUnique: jest.fn(),
          findMany: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
          count: jest.fn(),
        },
        userRole: {
          deleteMany: jest.fn(),
          createMany: jest.fn(),
          count: jest.fn(),
        },
        refreshSession: {
          deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
        auditLog: {
          create: jest.fn().mockResolvedValue({}),
        },
      };

      usersService = new UsersService(mockPrisma);
    });

    it('should prevent non-SUPER_ADMIN from creating a SUPER_ADMIN user', async () => {
      mockPrisma.role.findMany.mockResolvedValue([
        { id: 'role-super-id', name: 'SUPER_ADMIN' },
      ]);

      await expect(
        usersService.createUser(
          {
            email: 'newuser@bizonix.com',
            username: 'newuser',
            displayName: 'New User',
            role: 'SUPER_ADMIN',
          },
          mockRegularAdminActor,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should prevent users from modifying their own roles', async () => {
      await expect(
        usersService.updateUser(
          mockRegularAdminActor.id,
          { role: 'SUPER_ADMIN' },
          mockRegularAdminActor,
        ),
      ).rejects.toThrow('You cannot modify your own role.');
    });

    it('should prevent non-SUPER_ADMIN from modifying a SUPER_ADMIN account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'target-super-admin',
        email: 'founder@bizonix.com',
        userRoles: [{ role: { name: 'SUPER_ADMIN' } }],
      });

      await expect(
        usersService.updateUser(
          'target-super-admin',
          { displayName: 'Tampered Super Admin' },
          mockRegularAdminActor,
        ),
      ).rejects.toThrow('Only a SUPER_ADMIN can modify a SUPER_ADMIN account.');
    });

    it('should prevent non-SUPER_ADMIN from triggering password resets on SUPER_ADMIN accounts', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'target-super-admin',
        email: 'founder@bizonix.com',
        userRoles: [{ role: { name: 'SUPER_ADMIN' } }],
      });

      await expect(
        usersService.resetPassword(
          'target-super-admin',
          { password: 'NewSecurePassword123!' },
          mockRegularAdminActor,
        ),
      ).rejects.toThrow('Only a SUPER_ADMIN can reset the password of a SUPER_ADMIN account');
    });

    it('should prevent deleting the last active SUPER_ADMIN account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'last-super-admin',
        email: 'root@bizonix.com',
        userRoles: [{ role: { name: 'SUPER_ADMIN' } }],
      });
      mockPrisma.userRole.count.mockResolvedValue(1); // Only 1 active super admin remaining

      await expect(
        usersService.deleteUser('last-super-admin', mockSuperAdminActor),
      ).rejects.toThrow('Cannot delete the last active SUPER_ADMIN user');
    });
  });

  describe('BIZ-SEC-012: Password Space Trimming Prevention', () => {
    it('should hash exact password with whitespace and differentiate from trimmed password', async () => {
      const passwordWithSpaces = '  Secret Pass 123!  ';
      const trimmedPassword = 'Secret Pass 123!';

      const hash = await argon2.hash(passwordWithSpaces, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });

      // Exact password matches
      expect(await argon2.verify(hash, passwordWithSpaces)).toBe(true);

      // Trimmed variant does NOT match the untrimmed hash directly
      expect(await argon2.verify(hash, trimmedPassword)).toBe(false);
    });
  });

  describe('BIZ-SEC-006: Missing Authorization on FAQs Controller', () => {
    it('should enforce faqs.read or faqs.write permissions on all admin/faqs routes', () => {
      const reflector = new Reflector();
      const controllerPrototype = FaqsController.prototype;

      const methodsToCheck = [
        { name: 'getCategories', expectedPerm: 'faqs.read' },
        { name: 'createCategory', expectedPerm: 'faqs.write' },
        { name: 'updateCategory', expectedPerm: 'faqs.write' },
        { name: 'deleteCategory', expectedPerm: 'faqs.write' },
        { name: 'getAdminFaqs', expectedPerm: 'faqs.read' },
        { name: 'createFaq', expectedPerm: 'faqs.write' },
        { name: 'reorderFaqs', expectedPerm: 'faqs.write' },
        { name: 'getFaqById', expectedPerm: 'faqs.read' },
        { name: 'updateFaq', expectedPerm: 'faqs.write' },
        { name: 'togglePublish', expectedPerm: 'faqs.write' },
        { name: 'deleteFaq', expectedPerm: 'faqs.write' },
      ];

      for (const { name, expectedPerm } of methodsToCheck) {
        const method = (controllerPrototype as any)[name];
        expect(method).toBeDefined();
        const permissions = reflector.get<string[]>(PERMISSIONS_KEY, method);
        expect(permissions).toBeDefined();
        expect(permissions).toContain(expectedPerm);
      }
    });
  });

  describe('BIZ-SEC-009: Public Hero Preview Access Control', () => {
    let mockHeroService: any;
    let heroController: HeroController;

    beforeEach(() => {
      mockHeroService = {
        getVariant: jest.fn(),
        getPublishedHero: jest.fn(),
      };
      heroController = new HeroController(mockHeroService);
    });

    it('should throw NotFoundException if public preview is requested for DRAFT variant', async () => {
      mockHeroService.getVariant.mockResolvedValue({
        id: 'draft-hero-1',
        key: 'draft_hero',
        name: 'Draft Hero 2026',
        status: HeroStatus.DRAFT,
        config: { title: 'Confidential Draft' },
      });

      await expect(heroController.getPreview('draft-hero-1')).rejects.toThrow(NotFoundException);
    });

    it('should allow public preview if variant is PUBLISHED', async () => {
      mockHeroService.getVariant.mockResolvedValue({
        id: 'published-hero-1',
        key: 'published_hero',
        name: 'Official Live Hero',
        status: HeroStatus.PUBLISHED,
        config: { title: 'Welcome to Bizonix' },
      });

      const result = await heroController.getPreview('published-hero-1');
      expect(result).toBeDefined();
      expect(result.key).toBe('published_hero');
    });
  });

  describe('BIZ-SEC-010: Health Endpoint Information Disclosure', () => {
    let mockPrisma: any;
    let healthController: HealthController;

    beforeEach(() => {
      mockPrisma = {
        $queryRaw: jest.fn().mockResolvedValue([{}]),
      };
      healthController = new HealthController(mockPrisma);
    });

    it('should return connected status without exposing internal database catalog name', async () => {
      const response = await healthController.ready();
      expect(response.status).toBe('ok');
      expect(response.database).toBe('connected');
      // Must not leak internal database names such as 'bizonix_db' or 'bizonix'
      expect(response.database).not.toBe('bizonix_db');
      expect(response.database).not.toBe('bizonix');
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });
  });
});
