import {
  IsBoolean,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnnouncementBarDto {
  @IsBoolean()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsString()
  text!: string;

  @IsString()
  @IsOptional()
  linkText?: string;

  @IsString()
  @IsOptional()
  linkHref?: string;

  @IsString()
  @IsIn(['blue', 'navy', 'dark', 'amber', 'emerald'])
  theme!: string;

  @IsBoolean()
  @IsOptional()
  isDismissible?: boolean;
}

export class HeaderNavItemDto {
  @IsString()
  id!: string;

  @IsString()
  label!: string;

  @IsString()
  href!: string;

  @IsString()
  @IsIn(['link', 'mega-menu'])
  type!: 'link' | 'mega-menu';

  @IsString()
  @IsOptional()
  menu?: string; // 'solutions' | 'features' | 'industries' | 'custom'

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  isExternal?: boolean;

  @IsBoolean()
  isActive!: boolean;

  @IsInt()
  sortOrder!: number;
}

export class HeaderActionDto {
  @IsBoolean()
  isEnabled!: boolean;

  @IsString()
  label!: string;

  @IsString()
  href!: string;
}

export class HeaderConfigDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeaderNavItemDto)
  items!: HeaderNavItemDto[];

  @ValidateNested()
  @Type(() => HeaderActionDto)
  action!: HeaderActionDto;
}

export class MegaMenuItemDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  href!: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class MegaMenuGroupDto {
  @IsString()
  id!: string;

  @IsString()
  label!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MegaMenuItemDto)
  items!: MegaMenuItemDto[];
}

export class MegaMenuSummaryDto {
  @IsString()
  eyebrow!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  ctaLabel!: string;

  @IsString()
  ctaHref!: string;
}

export class MegaMenuDefinitionDto {
  @IsString()
  id!: string;

  @IsString()
  label!: string;

  @IsString()
  href!: string;

  @ValidateNested()
  @Type(() => MegaMenuSummaryDto)
  summary!: MegaMenuSummaryDto;

  @IsString()
  footerLabel!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MegaMenuGroupDto)
  groups!: MegaMenuGroupDto[];
}

export class FooterLinkDto {
  @IsString()
  id!: string;

  @IsString()
  label!: string;

  @IsString()
  href!: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  isActive!: boolean;

  @IsBoolean()
  @IsOptional()
  isExternal?: boolean;
}

export class FooterColumnDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsInt()
  sortOrder!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  links!: FooterLinkDto[];
}

export class FooterCtaDto {
  @IsBoolean()
  isEnabled!: boolean;

  @IsString()
  eyebrow!: string;

  @IsString()
  title!: string;

  @IsString()
  lede!: string;

  @IsString()
  primaryLabel!: string;

  @IsString()
  primaryHref!: string;

  @IsString()
  secondaryLabel!: string;

  @IsString()
  secondaryHref!: string;
}

export class BottomBarDto {
  @IsString()
  copyrightNotice!: string;

  @IsString()
  tagline!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  links!: FooterLinkDto[];
}

export class UpdateNavigationDto {
  @ValidateNested()
  @Type(() => AnnouncementBarDto)
  announcement!: AnnouncementBarDto;

  @ValidateNested()
  @Type(() => HeaderConfigDto)
  header!: HeaderConfigDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MegaMenuDefinitionDto)
  megaMenus!: MegaMenuDefinitionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterColumnDto)
  footerColumns!: FooterColumnDto[];

  @ValidateNested()
  @Type(() => FooterCtaDto)
  footerCta!: FooterCtaDto;

  @ValidateNested()
  @Type(() => BottomBarDto)
  bottomBar!: BottomBarDto;
}

export class AdminModuleOptionDto {
  id!: string;
  slug!: string;
  title!: string;
  category!: string;
  showInMegaMenu!: boolean;
  showInFooter!: boolean;
}

export class AdminIndustryOptionDto {
  id!: string;
  slug!: string;
  name!: string;
  category!: string;
  showInMegaMenu!: boolean;
  showInFooter!: boolean;
}

export class AdminNavigationResponseDto {
  config!: UpdateNavigationDto;
  availableModules!: AdminModuleOptionDto[];
  availableIndustries!: AdminIndustryOptionDto[];
  updatedAt?: Date;
}
