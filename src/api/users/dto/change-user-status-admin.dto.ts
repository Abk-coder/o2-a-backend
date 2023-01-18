import { IsNotEmpty } from 'class-validator';
import { UserStatus } from 'src/utils/enums/userStatus.enum';

export class ChangeUserStatusByAdminDto {
  @IsNotEmpty()
  userStatus: UserStatus;
}
