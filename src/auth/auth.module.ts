import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { Auth } from './auth.entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({ secret: 'iron_man' }),
    UsersModule,
    TypeOrmModule.forFeature([Auth]),
  ],
  providers: [AuthService],
})
export class AuthModule {}
