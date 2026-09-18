import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface AuditQuery {
  page?: string;
  limit?: string;
  action?: string;
  resourceType?: string;
  actorUserId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AuditQuery) {
    const page  = Math.max(1, parseInt(query.page  || '1',  10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '25', 10)));
    const skip  = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (query.action)        where.action       = { contains: query.action,       mode: 'insensitive' };
    if (query.resourceType)  where.resourceType = { contains: query.resourceType, mode: 'insensitive' };
    if (query.actorUserId)   where.actorUserId  = query.actorUserId;

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { action:       { contains: s, mode: 'insensitive' } },
        { resourceType: { contains: s, mode: 'insensitive' } },
        { resourceId:   { contains: s, mode: 'insensitive' } },
        { actor: { email:       { contains: s, mode: 'insensitive' } } },
        { actor: { displayName: { contains: s, mode: 'insensitive' } } },
      ];
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
      if (query.dateTo)   where.createdAt.lte = new Date(query.dateTo);
    }

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, displayName: true, email: true } },
        },
      }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getStats() {
    const [total, byAction, byResource, recentActors] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
        take: 10,
      }),
      this.prisma.auditLog.groupBy({
        by: ['resourceType'],
        _count: { resourceType: true },
        orderBy: { _count: { resourceType: 'desc' } },
      }),
      this.prisma.auditLog.findMany({
        where: { actorUserId: { not: null } },
        select: {
          actorUserId: true,
          actor: { select: { displayName: true, email: true } },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        distinct: ['actorUserId'],
      }),
    ]);

    return {
      total,
      topActions:      byAction.map(r => ({ action: r.action,               count: r._count.action })),
      byResourceType:  byResource.map(r => ({ type: r.resourceType,         count: r._count.resourceType })),
      recentActors:    recentActors.map(r => ({ actor: r.actor, lastSeen: r.createdAt })),
    };
  }
}
