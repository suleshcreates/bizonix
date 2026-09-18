import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RequirePermissions } from '../common/decorators';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'List all active admin users — used for the enquiry assignment dropdown' })
  findAll() {
    return this.usersService.findAllActive();
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
  @ApiOperation({ summary: 'Add a new employee to the team' })
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
