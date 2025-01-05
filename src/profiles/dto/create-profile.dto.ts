import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';
export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsObject()
  address?: { street: string; city: string; zip: string };

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;
}
