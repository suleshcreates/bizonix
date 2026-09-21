import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsIn(['SUPER_ADMIN', 'SITE_ADMIN', 'EDITOR', 'VIEWER'])
  role?: 'SUPER_ADMIN' | 'SITE_ADMIN' | 'EDITOR' | 'VIEWER';

  @IsOptional()
  @IsIn(['ACTIVE', 'DISABLED'])
  status?: 'ACTIVE' | 'DISABLED';
}

export class ResetPasswordDto {
  @IsOptional()
  @IsString()
  password?: string;
}
