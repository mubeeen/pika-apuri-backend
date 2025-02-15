import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserRepository } from './user.repository';
import { BuyerProfile } from 'src/buyer-profile/buyer-profile.entity';
import { SellerProfile } from 'src/seller-profile/seller-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BuyerProfile, SellerProfile])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
