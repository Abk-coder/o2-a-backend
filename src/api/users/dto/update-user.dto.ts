import { IsEmail, IsNumberString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;

  @IsOptional()
  username: string;

  @IsOptional()
  address: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  profilePhoto: string;
}
