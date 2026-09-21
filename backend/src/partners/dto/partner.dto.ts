import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Partner organization name', example: 'Razorpay' })
  @IsNotEmpty({ message: 'Partner name is required' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Category or domain', example: 'Payments & Checkout' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Logo image URL or uploaded file path' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Partner website link', example: 'https://razorpay.com' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Short description or partnership summary' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Sort display order index', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Whether featured in primary marquee', default: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Publication status', default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: 'Partner organization name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Category or domain' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Logo image URL or uploaded file path' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Partner website link' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ description: 'Short description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Sort display order index' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Whether featured in primary marquee' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Publication status' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class ReorderPartnersDto {
  @ApiProperty({ description: 'Array of partner IDs in desired display order' })
  @IsNotEmpty()
  ids!: string[];
}

export class PartnersConfigDto {
  @ApiPropertyOptional({ description: 'Section eyebrow badge', example: 'TRUSTED ECOSYSTEM' })
  @IsOptional()
  @IsString()
  eyebrow?: string;

  @ApiPropertyOptional({ description: 'Section title', example: 'Integrated with Premier Enterprise Platforms' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Section subtitle' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Marquee scroll speed in seconds', default: 35 })
  @IsOptional()
  @IsInt()
  speedSeconds?: number;

  @ApiPropertyOptional({ description: 'Whether to show the section on homepage', default: true })
  @IsOptional()
  @IsBoolean()
  showOnHomepage?: boolean;
}
