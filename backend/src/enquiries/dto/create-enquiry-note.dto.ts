import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnquiryNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;
}
