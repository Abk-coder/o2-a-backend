import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from 'src/utils/enums/gender.enum';
export class CreateUserDto {
  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  readonly lastname: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  readonly gender: Gender;

  @IsNotEmpty()
  username: string;

}
