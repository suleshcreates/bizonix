import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FaqLocation } from '@prisma/client';

export class CreateFaqDto {
  @ApiProperty({ description: 'The FAQ question' })
  @IsString()
  @IsNotEmpty()
  question!: string;

  @ApiProperty({ description: 'The detailed answer' })
  @IsString()
  @IsNotEmpty()
  answer!: string;

  @ApiPropertyOptional({ description: 'Optional short pill tag (e.g. Deployment, Access Control)' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({ enum: FaqLocation, default: FaqLocation.HOME })
  @IsEnum(FaqLocation)
  location: FaqLocation = FaqLocation.HOME;

  @ApiPropertyOptional({ description: 'ID of the category (primarily for HOME)' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Sort order index', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Whether FAQ is published and visible on the website', default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateFaqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ enum: FaqLocation })
  @IsOptional()
  @IsEnum(FaqLocation)
  location?: FaqLocation;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class ReorderItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty()
  @IsInt()
  sortOrder!: number;
}

export class ReorderFaqsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}

export class CreateFaqCategoryDto {
  @ApiProperty({ description: 'Unique category slug, e.g. operations' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ description: 'Display name, e.g. Core Operations' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of category' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: FaqLocation, default: FaqLocation.HOME })
  @IsOptional()
  @IsEnum(FaqLocation)
  location?: FaqLocation;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateFaqCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
