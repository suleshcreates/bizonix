import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'Registered work email or username', example: 'admin@bizonix.com' })
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString()
  identifier!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'User email address', example: 'admin@bizonix.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: '6-digit numeric OTP', example: '123456' })
  @IsNotEmpty({ message: 'OTP is required' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  otp!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'User email address', example: 'admin@bizonix.com' })
  @IsEmail({}, { message: 'Valid email is required' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Single-use reset token obtained after OTP verification' })
  @IsNotEmpty({ message: 'Reset token is required' })
  @IsString()
  resetToken!: string;

  @ApiProperty({ description: 'New password (min 8 characters, letters and numbers)', example: 'NewPass#2026' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current active password' })
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ description: 'New password (min 8 characters)', example: 'NewPass#2026' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword!: string;
}

