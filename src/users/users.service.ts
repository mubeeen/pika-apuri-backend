import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './users.entity';
import { Auth } from 'src/auth/auth.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import * as bcrypt from 'bcrypt';

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
  ): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const savedUser = await this.manager.save(User, newUser);

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
