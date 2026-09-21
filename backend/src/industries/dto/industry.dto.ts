import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IndustryStatus, IndustryAccent } from '@prisma/client';

// ---------------------------------------------------------------------------
// PUBLIC DTOs
// ---------------------------------------------------------------------------

export class IndustryListItemDto {
  id!: string;
  slug!: string;
  name!: string;
  category!: string;
  summary!: string;
  accent!: IndustryAccent;
  badge?: string | null;
  sortOrder!: number;
  status!: IndustryStatus;
  showInOverview!: boolean;
  showInMegaMenu!: boolean;
  showInHomepage!: boolean;
  showInFooter!: boolean;
  route!: string;
}

export class IndustryPublicDetailDto {
  slug!: string;
  name!: string;
  category!: string;
  summary!: string;
  accent!: IndustryAccent;
  badge?: string | null;
  content!: Record<string, any>;
  publishedAt!: Date | null;
}

// ---------------------------------------------------------------------------
// ADMIN DTOs
// ---------------------------------------------------------------------------

export class AdminIndustryDto {
  id!: string;
  slug!: string;
  name!: string;
  category!: string;
  summary!: string;
  accent!: IndustryAccent;
  badge?: string | null;
  sortOrder!: number;
  status!: IndustryStatus;
  everPublished!: boolean;
  version!: number;
  contentVersion!: number;
  showInOverview!: boolean;
  showInMegaMenu!: boolean;
  showInHomepage!: boolean;
  showInFooter!: boolean;
  content!: Record<string, any>;
  publishedAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export class AdminIndustryPreviewDto {
  slug!: string;
  name!: string;
  category!: string;
  summary!: string;
  accent!: IndustryAccent;
  badge?: string | null;
  content!: Record<string, any>;
  previewToken!: string;
  isDraft!: boolean;
}

// ---------------------------------------------------------------------------
// MUTATION DTOs
// ---------------------------------------------------------------------------

export class CreateIndustryDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsEnum(IndustryAccent)
  @IsOptional()
  accent?: IndustryAccent;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  showInOverview?: boolean;

  @IsBoolean()
  @IsOptional()
  showInMegaMenu?: boolean;

  @IsBoolean()
  @IsOptional()
  showInHomepage?: boolean;

  @IsBoolean()
  @IsOptional()
  showInFooter?: boolean;

  @IsOptional()
  content?: Record<string, any>;
}

export class UpdateIndustryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsEnum(IndustryAccent)
  @IsOptional()
  accent?: IndustryAccent;

  @IsString()
  @IsOptional()
  badge?: string | null;

  @IsBoolean()
  @IsOptional()
  showInOverview?: boolean;

  @IsBoolean()
  @IsOptional()
  showInMegaMenu?: boolean;

  @IsBoolean()
  @IsOptional()
  showInHomepage?: boolean;

  @IsBoolean()
  @IsOptional()
  showInFooter?: boolean;

  @IsOptional()
  content?: Record<string, any>;

  @IsNumber()
  @IsNotEmpty()
  expectedVersion!: number;
}

export class ReorderItemDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  @IsNotEmpty()
  sortOrder!: number;
}

export class ReorderIndustriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}
