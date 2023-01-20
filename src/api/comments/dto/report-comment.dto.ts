import { IsNotEmpty } from 'class-validator';

export class ReportCommentDto {
  @IsNotEmpty()
  reporterId: string;
}
