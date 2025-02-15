import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User, UserRole } from './users.entity';
import { Auth } from 'src/auth/auth.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import * as bcrypt from 'bcrypt';
import { BuyerProfile } from 'src/buyer-profile/buyer-profile.entity';
import { SellerProfile } from 'src/seller-profile/seller-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly manager: EntityManager,
  ) {}

  async createUserAndAuth(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
  ): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.role = role;

    const savedUser = await this.manager.save(User, newUser);

    if (role === UserRole.BUYER) {
      const buyerProfile = new BuyerProfile();
      buyerProfile.user = savedUser;
      await this.manager.save(BuyerProfile, buyerProfile);
    } else if (role === UserRole.SELLER) {
      const sellerProfile = new SellerProfile();
      sellerProfile.user = savedUser;
      await this.manager.save(SellerProfile, sellerProfile);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuth = new Auth();
    newAuth.user = savedUser;
    newAuth.passwordHash = hashedPassword;

    await this.manager.save(Auth, newAuth);

    return savedUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.manager.findOne(User, { where: { email } });
  }

  async findAuthByUserId(userId: string): Promise<Auth | undefined> {
    return this.manager.findOne(Auth, { where: { user: { id: userId } } });
  }

  async saveResetToken(
    userId: string,
    token: string,
    expiry: Date,
  ): Promise<void> {
    await this.userRepository.saveResetToken(userId, token, expiry);
  }

  async findUserById(userId: string): Promise<User | undefined> {
    return this.manager.findOne(User, { where: { id: userId } });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const auth = await this.manager.findOne(Auth, {
      where: { user: { id: userId } },
    });
    if (!auth) {
      throw new Error('Auth record not found for the user.');
    }

    auth.passwordHash = hashedPassword;
    await this.manager.save(Auth, auth);
  }

  async clearResetToken(userId: string): Promise<void> {
    const user = await this.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.manager.save(User, user);
  }
}
