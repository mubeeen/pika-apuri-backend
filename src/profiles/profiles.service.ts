import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Profile } from './profiles.entities';
import { CreateProfileDto, UpdateProfileDto } from './dto/index.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //create new profile
  async createProfile(
    userId: number,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    console.log('Ccegsg', userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const profile = this.profileRepository.create({
      user,
      ...createProfileDto,
    });
    return this.profileRepository.save(profile);
  }

  //get profile
  async getProfile(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID ${userId} not found`,
      );
    }
    return profile;
  }

  //update profile
  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID ${userId} not found`,
      );
    }

    Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }

  //delete profile
  async deleteProfile(userId: number): Promise<void> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile for user with ID ${userId} not found`,
      );
    }

    await this.profileRepository.remove(profile);
  }
}
