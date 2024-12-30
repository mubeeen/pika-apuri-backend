import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    try {
      return await this.authService.login(data);
    } catch {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signup')
  async signup(
    @Body()
    data: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    },
  ): Promise<any> {
    const user = await this.authService.register(
      data.email,
      data.password,
      data.firstname,
      data.lastname,
    );
    return user;
  }

  @Get('test')
  getHello(): string {
    return 'Hello, this is a direct response!';
  }
}
