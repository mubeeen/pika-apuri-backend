import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthResponseDTO } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);
  @Post('login')
  async login(
    @Body() data: { email: string; password: string },
    @I18n() i18n: I18nContext,
  ): Promise<AuthResponseDTO> {
    try {
      const loginResponse = await this.authService.login(data);
      // const message = (await i18n.t('test.HELLO')) as string;

      return {
        user: {
          id: loginResponse.loginData.id,
          role: loginResponse.loginData.role,
          firstName: loginResponse.loginData.firstName,
          lastName: loginResponse.loginData.lastName,
          email: loginResponse.loginData.email,
        },
        accessToken: loginResponse.accessToken,
      };
    } catch (error: any) {
      const errorMessage = error?.message || 'Internal server error';

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signup')
  async signup(@Body() data: SignupDto): Promise<AuthResponseDTO> {
    try {
      const { email, password, firstname, lastname, role } = data;

      const { user, accessToken } = await this.authService.register(
        email,
        password,
        firstname,
        lastname,
        role,
      );

      return {
        user: {
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        accessToken,
      };
    } catch (error: any) {
      const errorMessage = error?.message || 'Internal server error';
      console.error('Signup Error:', error);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    try {
      const { email } = forgotPassword;

      // Check if the email exists
      const emailExists = await this.authService.checkIfEmailExists(email);
      if (!emailExists) {
        this.logger.warn(`Forgot Password Attempt: Email not found - ${email}`);
        throw new HttpException(
          { message: 'User with this email does not exist!' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Generate reset token
      await this.authService.generateResetToken(email);

      this.logger.log(`Password reset link sent to: ${email}`);

      return {
        message:
          'A password reset link has been sent to your email. Please check your inbox!',
      };
    } catch (error) {
      this.logger.error('Forgot Password Error:', error);
      throw new HttpException(
        {
          message:
            'An error occurred while processing your request. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
