import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
