import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { ProfileService } from './profiles.service';
import { Profile } from './profiles.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [ProfilesController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfilesModule {}
