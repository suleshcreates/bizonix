import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HeroStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublishedHero() {
    const publishState = await this.prisma.homeHeroPublishState.findUnique({
      where: { id: 'singleton' },
      include: {
        publishedVariant: true,
      },
    });

    if (!publishState || !publishState.publishedVariant) {
      throw new NotFoundException('No published hero variant found');
    }

    const variant = publishState.publishedVariant;
    const configObj = (typeof variant.config === 'object' && variant.config !== null) ? variant.config : {};
    return {
      id: variant.id,
      key: variant.key,
      name: variant.name,
      ...configObj,
      config: variant.config,
    };
  }

  async getAllVariants() {
    return this.prisma.homeHeroVariant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublishState() {
    return this.prisma.homeHeroPublishState.findUnique({
      where: { id: 'singleton' },
      include: {
        publishedVariant: { select: { id: true, name: true, key: true } },
        draftVariant: { select: { id: true, name: true, key: true } },
      }
    });
  }

  async getVariant(idOrKey: string) {
    let variant = await this.prisma.homeHeroVariant.findUnique({
      where: { id: idOrKey },
    });
    if (!variant) {
      variant = await this.prisma.homeHeroVariant.findUnique({
        where: { key: idOrKey },
      });
    }
    if (!variant) {
      throw new NotFoundException('Hero variant not found');
    }
    return variant;
  }

  async setDraft(id: string, userId: string, ip: string, userAgent: string) {
    await this.getVariant(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.homeHeroVariant.update({
        where: { id },
        data: { status: HeroStatus.DRAFT }
      });

      await tx.homeHeroPublishState.upsert({
        where: { id: 'singleton' },
        update: { draftVariantId: id, updatedByUserId: userId },
        create: { id: 'singleton', draftVariantId: id, updatedByUserId: userId }
      });

      await tx.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'HERO_SET_DRAFT',
          resourceType: 'hero',
          resourceId: id,
          ipAddress: ip,
          userAgent,
        }
      });
    });

    return this.getVariant(id);
  }

  async publish(id: string, userId: string, ip: string, userAgent: string) {
    await this.getVariant(id);

    await this.prisma.$transaction(async (tx) => {
      const currentState = await tx.homeHeroPublishState.findUnique({ where: { id: 'singleton' } });
      const previousPublishedId = currentState?.publishedVariantId;

      if (previousPublishedId && previousPublishedId !== id) {
        // Demote previous to DRAFT or ARCHIVED depending on business logic. For now, just DRAFT.
        await tx.homeHeroVariant.update({
          where: { id: previousPublishedId },
          data: { status: HeroStatus.DRAFT }
        });
      }

      await tx.homeHeroVariant.update({
        where: { id },
        data: { status: HeroStatus.PUBLISHED }
      });

      await tx.homeHeroPublishState.upsert({
        where: { id: 'singleton' },
        update: { 
          publishedVariantId: id, 
          draftVariantId: null, // Clear draft slot if the newly published item was the draft
          updatedByUserId: userId,
          publishedAt: new Date()
        },
        create: { 
          id: 'singleton', 
          publishedVariantId: id, 
          updatedByUserId: userId,
          publishedAt: new Date()
        }
      });

      await tx.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'HERO_PUBLISHED',
          resourceType: 'hero',
          resourceId: id,
          ipAddress: ip,
          userAgent,
        }
      });
    });

    return this.getVariant(id);
  }

  async archive(id: string, userId: string, ip: string, userAgent: string) {
    await this.getVariant(id);
    
    // Check if it's currently published
    const publishState = await this.prisma.homeHeroPublishState.findUnique({ where: { id: 'singleton' }});
    if (publishState?.publishedVariantId === id) {
      throw new BadRequestException('Cannot archive the currently published hero');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.homeHeroVariant.update({
        where: { id },
        data: { status: HeroStatus.ARCHIVED }
      });

      if (publishState?.draftVariantId === id) {
        await tx.homeHeroPublishState.update({
          where: { id: 'singleton' },
          data: { draftVariantId: null }
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'HERO_ARCHIVED',
          resourceType: 'hero',
          resourceId: id,
          ipAddress: ip,
          userAgent,
        }
      });
    });

    return this.getVariant(id);
  }
}
