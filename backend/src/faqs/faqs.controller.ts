import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FaqsService } from './faqs.service';
import { FaqLocation } from '@prisma/client';
import { RequirePermissions } from '../common/decorators';
import {
  CreateFaqDto,
  UpdateFaqDto,
  CreateFaqCategoryDto,
  UpdateFaqCategoryDto,
  ReorderFaqsDto,
} from './dto/faq.dto';

@ApiTags('Admin/FAQs')
@Controller('admin/faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════

  @Get('categories')
  @RequirePermissions('faqs.read')
  @ApiOperation({ summary: 'List FAQ categories' })
  @ApiQuery({ name: 'location', enum: FaqLocation, required: false })
  getCategories(@Query('location') location?: FaqLocation) {
    return this.faqsService.getCategories(location);
  }

  @Post('categories')
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Create a new FAQ category' })
  createCategory(@Body() dto: CreateFaqCategoryDto) {
    return this.faqsService.createCategory(dto);
  }

  @Put('categories/:id')
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Update an FAQ category' })
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateFaqCategoryDto,
  ) {
    return this.faqsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Delete an FAQ category' })
  deleteCategory(@Param('id') id: string) {
    return this.faqsService.deleteCategory(id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FAQS
  // ═══════════════════════════════════════════════════════════════════════════

  @Get()
  @RequirePermissions('faqs.read')
  @ApiOperation({ summary: 'List all FAQs with filters' })
  @ApiQuery({ name: 'location', enum: FaqLocation, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  getAdminFaqs(
    @Query('location') location?: FaqLocation,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.faqsService.getAdminFaqs({ location, categoryId, search });
  }

  @Post()
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Create a new FAQ item' })
  createFaq(@Body() dto: CreateFaqDto) {
    return this.faqsService.createFaq(dto);
  }

  @Post('reorder')
  @RequirePermissions('faqs.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder FAQs' })
  reorderFaqs(@Body() dto: ReorderFaqsDto) {
    return this.faqsService.reorderFaqs(dto);
  }

  @Get(':id')
  @RequirePermissions('faqs.read')
  @ApiOperation({ summary: 'Get FAQ by ID' })
  getFaqById(@Param('id') id: string) {
    return this.faqsService.getFaqById(id);
  }

  @Put(':id')
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Update an FAQ item' })
  updateFaq(
    @Param('id') id: string,
    @Body() dto: UpdateFaqDto,
  ) {
    return this.faqsService.updateFaq(id, dto);
  }

  @Patch(':id/toggle-publish')
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Toggle publish status of an FAQ' })
  togglePublish(@Param('id') id: string) {
    return this.faqsService.togglePublish(id);
  }

  @Delete(':id')
  @RequirePermissions('faqs.write')
  @ApiOperation({ summary: 'Delete an FAQ item' })
  deleteFaq(@Param('id') id: string) {
    return this.faqsService.deleteFaq(id);
  }
}
