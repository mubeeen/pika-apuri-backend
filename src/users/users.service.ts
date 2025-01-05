import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './users.entity';
import { Auth } from 'src/auth/auth.entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly manager: EntityManager) {}

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

  async findAuthByUserId(userId: number): Promise<Auth | undefined> {
    return this.manager.findOne(Auth, { where: { user: { id: userId } } });
  }
}
