import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RespondToEnquiryDto {
  @ApiProperty({ description: 'Email subject shown to the prospect.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  subject!: string;

  @ApiProperty({ description: 'Plain-text response from the Bizonix team.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  message!: string;

  @ApiPropertyOptional({ description: 'Optional confirmed demo date. Scheduling it moves the enquiry to DEMO_SCHEDULED.' })
  @IsOptional()
  @IsDateString()
  demoDate?: string;
}
