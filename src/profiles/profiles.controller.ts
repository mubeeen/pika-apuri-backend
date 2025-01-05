import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/index.dto';

@Controller('profile')
export class ProfilesController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':userId')
  async createProfile(
    @Param('id') userId: number,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(userId, createProfileDto);
  }

  @Get(':userId')
  async getProfile(@Param('userId') userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Delete(':userId')
  async deleteProfile(@Param('userId') userId: number) {
    return this.profileService.deleteProfile(userId);
  }
}
