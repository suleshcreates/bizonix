import { IsEmail, IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @IsOptional()
  @IsIn(['SUPER_ADMIN', 'SITE_ADMIN', 'EDITOR', 'VIEWER'])
  role?: 'SUPER_ADMIN' | 'SITE_ADMIN' | 'EDITOR' | 'VIEWER';

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
