import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
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

