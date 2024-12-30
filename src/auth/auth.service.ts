import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) return null;

    const auth = await this.userService.findAuthByUserId(user.id);
    if (auth && (await bcrypt.compare(password, auth.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(data: any): Promise<{ accessToken: string }> {
    const loginData = await this.validateUser(data.email, data.password);
    if (!loginData) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: loginData.email, sub: loginData.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ) {
    const user = await this.userService.createUserAndAuth(
      email,
      password,
      firstname,
      lastname,
    );

    return user;
  }
}
