import { IsEmail, IsOptional } from 'class-validator';


export class UpdateUserAdminDto {
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
}
