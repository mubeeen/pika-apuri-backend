import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  buyerProfileSkills?: string[];

  @IsOptional()
  @IsArray()
  sellerProfileSkills?: string[];

}
