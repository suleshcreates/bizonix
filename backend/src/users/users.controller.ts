import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RequirePermissions, CurrentUser, AuthenticatedUser } from '../common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ResetPasswordDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'List all admin users with status, roles, and security flags' })
  findAll() {
    return this.usersService.findAllAdminUsers();
  }

  @Get('roles')
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'List all available system roles' })
  getRoles() {
    return this.usersService.getAvailableRoles();
  }

  @Get('team')
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'Get full team details with lead metrics' })
  findTeam() {
    return this.usersService.findTeam();
  }

  @Get(':id')
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'Get a single employee profile with full history and stats' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @RequirePermissions('users.write')
  @ApiOperation({ summary: 'Add a new employee or admin user' })
  createUser(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.createUser(dto, user);
  }

  @Patch(':id')
  @RequirePermissions('users.write')
  @ApiOperation({ summary: 'Update user profile, email, username, or role' })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.updateUser(id, dto, user);
  }

  @Post(':id/reset-password')
  @RequirePermissions('users.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset a user password' })
  resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.resetPassword(id, dto, user);
  }

  @Patch(':id/toggle-status')
  @RequirePermissions('users.write')
  @ApiOperation({ summary: 'Toggle user status between ACTIVE and DISABLED' })
  toggleStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.toggleStatus(id, user);
  }

  @Post(':id/unlock')
  @RequirePermissions('users.write')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlock a locked user account' })
  unlockUser(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.unlockUser(id, user);
  }

  @Delete(':id')
  @RequirePermissions('users.write')
  @ApiOperation({ summary: 'Delete a user account' })
  deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.deleteUser(id, user);
  }
}
