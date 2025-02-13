import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: { email: string; password: string },
    @I18n() i18n: I18nContext,
  ): Promise<{ accessToken: string; message: string }> {
    try {
      const loginResponse = await this.authService.login(data);

      const message = (await i18n.t('test.HELLO')) as string;

      return {
        accessToken: loginResponse.accessToken,
        message,
      };
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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    const { email } = forgotPassword;
    const emailExists = await this.authService.checkIfEmailExists(email);
    if (!emailExists) {
      return { message: 'User with this email doesnt exist!' };
    }
    await this.authService.generateResetToken(email);

    return {
      message: 'The reset password link has been sent to the provided email!',
    };
  }
  @Post('reset-password')
  async resetPassword(
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const isReset = await this.authService.resetPassword(token, newPassword);

    if (!isReset) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: 'Password reset successfully' };
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
