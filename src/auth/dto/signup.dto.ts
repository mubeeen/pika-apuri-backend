import { IsEmail, IsNotEmpty, IsString, IsIn, IsEnum } from 'class-validator';
import { UserRole } from 'src/users/users.entity';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEnum(UserRole)  
  role: UserRole;

}
