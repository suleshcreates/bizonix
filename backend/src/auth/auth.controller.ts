import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto, ChangePasswordDto } from './dto/password-reset.dto';
import { Public, CurrentUser, AuthenticatedUser } from '../common/decorators';
import { Throttle } from '@nestjs/throttler';

const ACCESS_COOKIE = 'bz_admin_access';
const REFRESH_COOKIE = 'bz_admin_refresh';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login using email and password' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ip = request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';

    const { accessToken, refreshToken, expiresAt } = await this.authService.login(loginDto, ip, userAgent);

    this.setAuthCookies(response, accessToken, refreshToken, expiresAt);
    return { success: true };
  }

  @Public()
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const currentRefreshToken = request.cookies[REFRESH_COOKIE];
    if (!currentRefreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const ip = request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';

    const { accessToken, refreshToken, expiresAt } = await this.authService.refresh(
      currentRefreshToken,
      ip,
      userAgent,
    );

    this.setAuthCookies(response, accessToken, refreshToken, expiresAt);
    return { success: true };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear cookies' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const currentRefreshToken = request.cookies[REFRESH_COOKIE];
    const ip = request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = request.headers['user-agent'] || 'unknown';

    await this.authService.logout(currentRefreshToken, user.id, ip, userAgent);

    response.clearCookie(ACCESS_COOKIE, { path: '/' });
    response.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth/refresh' });

    return { success: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Public()
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request 6-digit OTP verification code to reset password' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() request: Request,
  ) {
    const ip = request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';
    const userAgent = (request.headers['user-agent'] as string) || 'unknown';
    return this.authService.requestPasswordReset(dto.identifier, ip, userAgent);
  }

  @Public()
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify 6-digit OTP and receive one-time reset token' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyPasswordResetOtp(dto.email, dto.otp);
  }

  @Public()
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using reset token' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ip = request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';
    const userAgent = (request.headers['user-agent'] as string) || 'unknown';
    const result = await this.authService.completePasswordReset(
      dto.email.trim(),
      dto.resetToken.trim(),
      dto.newPassword,
      ip,
      userAgent,
    );

    if (result.session) {
      this.setAuthCookies(
        response,
        result.session.accessToken,
        result.session.refreshToken,
        result.session.expiresAt,
      );
    }

    return result;
  }

  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for currently authenticated user' })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ip = request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';
    const userAgent = (request.headers['user-agent'] as string) || 'unknown';
    const result = await this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
      ip,
      userAgent,
    );

    if (result.session) {
      this.setAuthCookies(
        response,
        result.session.accessToken,
        result.session.refreshToken,
        result.session.expiresAt,
      );
    }

    return result;
  }

  private setAuthCookies(response: Response, accessToken: string, refreshToken: string, refreshExpiresAt: Date) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token cookie (short lived, handled by JWT expiry but cleared on session end)
    response.cookie(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });

    // Refresh token cookie (long lived, restricted path to /auth/refresh)
    response.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth/refresh', // Only sent to refresh endpoint
      expires: refreshExpiresAt,
    });
  }
}

