import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatAllergiesFileDto {
  @IsNotEmpty()
  postId: string;

  @IsNotEmpty()
  patientId: string;

  @IsOptional()
  specialistId: string;
}
