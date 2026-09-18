import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EnquiryPriority } from '@prisma/client';

export class UpdateEnquiryDetailsDto {
  @ApiPropertyOptional({ enum: EnquiryPriority })
  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextAction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  demoDate?: string | null;
}
