import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(['buyer', 'seller'])
  role: 'buyer' | 'seller';

  @IsOptional() 
  buyerProfile?: {
    bio: string;
    phoneNumber: string;
    skills: string[];
    interests: string[];
  };

  @IsOptional() 
  sellerProfile?: {
    bio: string;
    phoneNumber: string;
    skills: string[];
    interests: string[];
  };
}
