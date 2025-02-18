import { IsString } from 'class-validator';
import { UserData } from '../interfaces/user.interface';

export class AuthResponseDTO {
  user: UserData; 

  @IsString()
  accessToken: string;
}
