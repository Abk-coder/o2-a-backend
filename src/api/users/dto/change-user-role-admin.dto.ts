import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/utils/enums/role.enum';

export class ChangeUserRoleByAdminDto {
  @IsNotEmpty()
  role: Role;
}
