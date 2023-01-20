import { IsNotEmpty } from 'class-validator';

export class UnreportCommentDto {
  @IsNotEmpty()
  unreporterId: string;
}
