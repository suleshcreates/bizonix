import { IsEmail, IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsOptional()
  @IsIn(['SITE_ADMIN', 'SUPER_ADMIN'])
  role?: 'SITE_ADMIN' | 'SUPER_ADMIN';

  @IsOptional()
  @IsString()
  username?: string;
}
