import { Document } from 'mongoose';
import { Gender } from 'src/utils/enums/gender.enum';
import { Role } from 'src/utils/enums/role.enum';
import { UserStatus } from 'src/utils/enums/userStatus.enum';

export interface User extends Document {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  address: string;
  phoneNumber: string;
  password: string;
  profilePhoto: string;
  passwordIsInitialized: boolean;
  passwordIsForgot: boolean;
  readonly created_at: Date;
  updated_at: Date;
  role: Role;
  readonly gender: Gender;
  accessToken: string;
  emailConfirmed: boolean;
  userStatus: UserStatus;
  dateOfBirth: Date;
  lastLogin: Date;
  validationCode: string;
  validationTryLimit: number;
  codeExpirationTime: number;
}
