import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string | null;
  permissions: string[];
  roles: string[];
}

/**
 * Extract the authenticated user from the request.
 * Populated by AuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as any)['user'] as AuthenticatedUser;
  },
);
