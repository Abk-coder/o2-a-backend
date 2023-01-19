import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  text: string;

  @IsOptional()
  picture: string;

  @IsOptional()
  audio: string;

  @IsOptional()
  video: string;
}
