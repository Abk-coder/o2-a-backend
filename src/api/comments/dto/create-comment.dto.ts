import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  postId: string;
  @IsNotEmpty()
  text: string;
}
