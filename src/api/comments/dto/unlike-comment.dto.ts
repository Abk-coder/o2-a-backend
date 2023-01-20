import { IsNotEmpty } from 'class-validator';

export class UnlikeCommentDto {
  @IsNotEmpty()
  unlikerId: string;
}
