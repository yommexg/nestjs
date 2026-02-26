import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Param,
  Post,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import type { UUID } from 'crypto';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { ProfilesGuard } from './profiles.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  // GET /profiles
  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  // GET /profiles/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.profileService.findOne(id);
  }

  // POST /profiles
  @Post()
  create(@Body(ValidationPipe) createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  // PUT /profiles/:id
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }

  // DELETE /profiles/:id
  @Delete(':id')
  @UseGuards(ProfilesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.profileService.remove(id);
  }
}
