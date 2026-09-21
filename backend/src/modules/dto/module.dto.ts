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
import { ModuleStatus, ModuleThemeKey, ModuleIconKey } from '@prisma/client';

// ---------------------------------------------------------------------------
// PUBLIC DTOs
// ---------------------------------------------------------------------------

export class ModuleListItemDto {
  id!: string;
  slug!: string;
  title!: string;
  category!: string;
  summary!: string;
  outcome!: string;
  themeKey!: ModuleThemeKey;
  iconKey!: ModuleIconKey;
  badge?: string | null;
  sortOrder!: number;
  showInCatalog!: boolean;
  showInMegaMenu!: boolean;
  showInHomepage!: boolean;
  showInFooter!: boolean;
  route!: string;
}

export class ModuleFaqDto {
  id!: string;
  question!: string;
  answer!: string;
  sortOrder!: number;
}

export class ModulePublicDetailDto {
  slug!: string;
  title!: string;
  category!: string;
  summary!: string;
  outcome!: string;
  themeKey!: ModuleThemeKey;
  iconKey!: ModuleIconKey;
  badge?: string | null;
  content!: Record<string, any>;
  faqs!: ModuleFaqDto[];
  publishedAt!: Date | null;
}

// ---------------------------------------------------------------------------
// ADMIN DTOs
// ---------------------------------------------------------------------------

export class AdminModuleFaqDto {
  id!: string;
  question!: string;
  answer!: string;
  sortOrder!: number;
  isPublished!: boolean;
}

export class AdminModuleDto {
  id!: string;
  slug!: string;
  title!: string;
  category!: string;
  summary!: string;
  outcome!: string;
  themeKey!: ModuleThemeKey;
  iconKey!: ModuleIconKey;
  badge?: string | null;
  sortOrder!: number;
  status!: ModuleStatus;
  everPublished!: boolean;
  version!: number;
  contentVersion!: number;
  showInCatalog!: boolean;
  showInMegaMenu!: boolean;
  showInHomepage!: boolean;
  showInFooter!: boolean;
  content!: Record<string, any>;
  faqs!: AdminModuleFaqDto[];
  publishedAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export class AdminModulePreviewDto {
  slug!: string;
  title!: string;
  category!: string;
  summary!: string;
  outcome!: string;
  themeKey!: ModuleThemeKey;
  iconKey!: ModuleIconKey;
  badge?: string | null;
  content!: Record<string, any>;
  faqs!: ModuleFaqDto[];
  previewToken!: string;
  isDraft!: boolean;
}

// ---------------------------------------------------------------------------
// MUTATION DTOs
// ---------------------------------------------------------------------------

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsString()
  @IsNotEmpty()
  outcome!: string;

  @IsEnum(ModuleThemeKey)
  @IsOptional()
  themeKey?: ModuleThemeKey;

  @IsEnum(ModuleIconKey)
  @IsOptional()
  iconKey?: ModuleIconKey;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  showInCatalog?: boolean;

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

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  outcome?: string;

  @IsEnum(ModuleThemeKey)
  @IsOptional()
  themeKey?: ModuleThemeKey;

  @IsEnum(ModuleIconKey)
  @IsOptional()
  iconKey?: ModuleIconKey;

  @IsString()
  @IsOptional()
  badge?: string | null;

  @IsBoolean()
  @IsOptional()
  showInCatalog?: boolean;

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

  @IsArray()
  @IsOptional()
  faqs?: Array<{
    id?: string;
    question: string;
    answer: string;
    sortOrder?: number;
    isPublished?: boolean;
  }>;

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

export class ReorderModulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}
