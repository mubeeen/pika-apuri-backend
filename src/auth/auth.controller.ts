import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';

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

  @UseGuards(JwtAuthGuard)
  @Get('tests')
  async getHello(@I18n() i18n: I18nContext) {
    const currentLang = i18n.lang;
    console.log('current lang', currentLang);
    const message = await i18n.t('greeting', { lang: 'sv' });
    console.log('MESSAGE', message);

    return await i18n.t('greeting', { lang: currentLang });
  }
}
