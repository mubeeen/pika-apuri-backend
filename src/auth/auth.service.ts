import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRole } from 'src/users/users.entity';

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

  async login(data: any): Promise<{ loginData: any; accessToken: string }> {
    const loginData = await this.validateUser(data.email, data.password);
    if (!loginData) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: loginData.email, sub: loginData.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      loginData,
      accessToken,
    };
  }

  async register(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    role: UserRole,
  ) {
    const existingUser = await this.checkIfEmailExists(email);
    if (existingUser) {
      throw new HttpException(
        'Email already in use. Please use a different email.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.createUserAndAuth(
      email,
      password,
      firstname,
      lastname,
      role,
    );

    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    const user = await this.userService.findUserByEmail(email);
    return !!user;
  }

  async generateResetToken(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.RESET_TOKEN_SECRET, expiresIn: '15m' },
    );

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    await this.userService.saveResetToken(user.id, resetToken, expiryDate);

    await this.sendResetEmail(email, resetToken);
  }

  private async sendResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(`Sending email to ${email} with reset link: ${resetLink}`);
    // Implement email sending logic here
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.RESET_TOKEN_SECRET,
      });
    } catch (e) {
      return false;
    }

    //verify token
    const user = await this.userService.findUserById(payload.userId);
    if (
      !user ||
      user.resetToken !== token ||
      new Date() > user.resetTokenExpiry
    ) {
      return false;
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.id, hashedPassword);

    // Clear the reset token
    await this.userService.clearResetToken(user.id);

    return true;
  }
}
