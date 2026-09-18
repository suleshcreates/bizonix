import { Controller, Get, Post, Patch, Param, Body, Query, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from './dto/update-enquiry-status.dto';
import { AssignEnquiryDto } from './dto/assign-enquiry.dto';
import { CreateEnquiryNoteDto } from './dto/create-enquiry-note.dto';
import { UpdateEnquiryDetailsDto } from './dto/update-enquiry-details.dto';
import { EnquiryQueryDto } from './dto/enquiry-query.dto';
import { RespondToEnquiryDto } from './dto/respond-to-enquiry.dto';
import { RequirePermissions, CurrentUser, AuthenticatedUser, Public } from '../common/decorators';

@ApiTags('Enquiries')
@Controller()
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Public()
  @Throttle({ short: { limit: 3, ttl: 60_000 } })
  @Post('enquiries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Public intake form for demo/contact enquiries' })
  async publicCreate(@Body() dto: CreateEnquiryDto, @Req() req: Request) {
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
    const userAgent = (req.headers['user-agent'] || 'unknown') as string;
    const enquiry = await this.enquiriesService.create(dto, ip, userAgent);
    return {
      success: true,
      message: 'Your enquiry has been received. Our team will contact you shortly.',
      id: enquiry.id,
    };
  }

  @Get('admin/enquiries')
  @RequirePermissions('enquiries.read')
  @ApiOperation({ summary: 'List all enquiries with search, filtering, and pagination' })
  async findAll(@Query() query: EnquiryQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.enquiriesService.findAll(query, user);
  }

  @Get('admin/enquiries/stats')
  @RequirePermissions('enquiries.read')
  @ApiOperation({ summary: 'Get aggregated counts by status' })
  async getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.enquiriesService.getStats(user);
  }

  @Get('admin/enquiries/:id')
  @RequirePermissions('enquiries.read')
  @ApiOperation({ summary: 'Get full enquiry details with timeline and private notes' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.enquiriesService.findOne(id, user);
  }

  @Patch('admin/enquiries/:id/status')
  @RequirePermissions('enquiries.write')
  @ApiOperation({ summary: 'Update enquiry status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEnquiryStatusDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
    const userAgent = (req.headers['user-agent'] || 'unknown') as string;
    return this.enquiriesService.updateStatus(id, dto, user, ip, userAgent);
  }

  @Patch('admin/enquiries/:id/assign')
  @RequirePermissions('enquiries.write')
  @ApiOperation({ summary: 'Assign enquiry to a user' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignEnquiryDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
    const userAgent = (req.headers['user-agent'] || 'unknown') as string;
    return this.enquiriesService.assign(id, dto, user, ip, userAgent);
  }

  @Patch('admin/enquiries/:id/details')
  @RequirePermissions('enquiries.write')
  @ApiOperation({ summary: 'Update enquiry details (priority, next action, demo date)' })
  async updateDetails(
    @Param('id') id: string,
    @Body() dto: UpdateEnquiryDetailsDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
    const userAgent = (req.headers['user-agent'] || 'unknown') as string;
    return this.enquiriesService.updateDetails(id, dto, user, ip, userAgent);
  }

  @Post('admin/enquiries/:id/notes')
  @RequirePermissions('enquiries.write')
  @ApiOperation({ summary: 'Add private internal note to enquiry' })
  async addNote(
    @Param('id') id: string,
    @Body() dto: CreateEnquiryNoteDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.enquiriesService.addNote(id, dto, user);
  }

  @Post('admin/enquiries/:id/respond')
  @RequirePermissions('enquiries.write')
  @ApiOperation({ summary: 'Send a prospect reply, optionally schedule the demo, and record delivery' })
  async respond(
    @Param('id') id: string,
    @Body() dto: RespondToEnquiryDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const ip = (req.ip || req.headers['x-forwarded-for'] || 'unknown') as string;
    const userAgent = (req.headers['user-agent'] || 'unknown') as string;
    return this.enquiriesService.respond(id, dto, user, ip, userAgent);
  }
}
