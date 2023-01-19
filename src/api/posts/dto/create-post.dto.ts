import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatPostDto {
  @IsNotEmpty()
  posterId: any;

  @IsOptional()
  text: string;

  @IsOptional()
  picture: string;

  @IsOptional()
  audio: string;

  @IsOptional()
  video: string;
}
