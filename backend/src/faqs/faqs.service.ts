import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FaqLocation } from '@prisma/client';
import {
  CreateFaqDto,
  UpdateFaqDto,
  CreateFaqCategoryDto,
  UpdateFaqCategoryDto,
  ReorderFaqsDto,
} from './dto/faq.dto';

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC QUERIES
  // ═══════════════════════════════════════════════════════════════════════════

  async getPublicFaqs(location?: FaqLocation) {
    const loc = location || FaqLocation.HOME;

    // Fetch categories for this location
    const categories = await this.prisma.faqCategory.findMany({
      where: { location: loc },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    // Fetch published FAQs
    const faqs = await this.prisma.faqItem.findMany({
      where: {
        location: loc,
        isPublished: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    return {
      location: loc,
      categories,
      faqs: faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        tag: f.tag,
        sortOrder: f.sortOrder,
        category: f.category?.slug || null,
        categoryName: f.category?.name || null,
        categoryId: f.categoryId,
      })),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN QUERIES & CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  async getAdminFaqs(params: {
    location?: FaqLocation;
    categoryId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (params.location) {
      where.location = params.location;
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { question: { contains: q, mode: 'insensitive' } },
        { answer: { contains: q, mode: 'insensitive' } },
        { tag: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [faqs, categories] = await Promise.all([
      this.prisma.faqItem.findMany({
        where,
        orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.faqCategory.findMany({
        orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }],
      }),
    ]);

    return {
      faqs,
      categories,
      total: faqs.length,
    };
  }

  async getFaqById(id: string) {
    const faq = await this.prisma.faqItem.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!faq) throw new NotFoundException(`FAQ with ID ${id} not found`);
    return faq;
  }

  async createFaq(dto: CreateFaqDto) {
    if (dto.categoryId) {
      const cat = await this.prisma.faqCategory.findUnique({
        where: { id: dto.categoryId },
      });
      if (!cat) throw new NotFoundException(`Category ${dto.categoryId} not found`);
    }

    return this.prisma.faqItem.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        tag: dto.tag || null,
        location: dto.location,
        categoryId: dto.categoryId || null,
        sortOrder: dto.sortOrder ?? 0,
        isPublished: dto.isPublished ?? true,
      },
      include: { category: true },
    });
  }

  async updateFaq(id: string, dto: UpdateFaqDto) {
    await this.getFaqById(id);

    if (dto.categoryId) {
      const cat = await this.prisma.faqCategory.findUnique({
        where: { id: dto.categoryId },
      });
      if (!cat) throw new NotFoundException(`Category ${dto.categoryId} not found`);
    }

    return this.prisma.faqItem.update({
      where: { id },
      data: {
        ...(dto.question !== undefined && { question: dto.question }),
        ...(dto.answer !== undefined && { answer: dto.answer }),
        ...(dto.tag !== undefined && { tag: dto.tag }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
      include: { category: true },
    });
  }

  async togglePublish(id: string) {
    const faq = await this.getFaqById(id);
    return this.prisma.faqItem.update({
      where: { id },
      data: { isPublished: !faq.isPublished },
      include: { category: true },
    });
  }

  async deleteFaq(id: string) {
    await this.getFaqById(id);
    return this.prisma.faqItem.delete({ where: { id } });
  }

  async reorderFaqs(dto: ReorderFaqsDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.faqItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );
    return { success: true, count: dto.items.length };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  async getCategories(location?: FaqLocation) {
    return this.prisma.faqCategory.findMany({
      where: location ? { location } : undefined,
      orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }],
      include: {
        _count: { select: { faqs: true } },
      },
    });
  }

  async createCategory(dto: CreateFaqCategoryDto) {
    const existing = await this.prisma.faqCategory.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Category slug '${dto.slug}' already exists`);
    }

    return this.prisma.faqCategory.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description || null,
        location: dto.location || FaqLocation.HOME,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateFaqCategoryDto) {
    const existing = await this.prisma.faqCategory.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException(`Category with ID ${id} not found`);

    return this.prisma.faqCategory.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.faqCategory.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException(`Category with ID ${id} not found`);

    return this.prisma.faqCategory.delete({ where: { id } });
  }
}
