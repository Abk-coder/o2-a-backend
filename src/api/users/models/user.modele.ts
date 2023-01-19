import * as mongoose from 'mongoose';
import { Gender } from 'src/utils/enums/gender.enum';
import { Role } from 'src/utils/enums/role.enum';
import { UserStatus } from 'src/utils/enums/userStatus.enum';
import { generateSalt, hashPassword } from 'src/utils/helpers/bcrypt';

export const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    index: true,
    required: true,
  },
  lastname: {
    type: String,
    index: true,
    required: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
    unique: true,
    index: true,
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
    index: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordIsInitialized: {
    type: Boolean,
    required: true,
    default: false,
  },
  passwordIsForgot: {
    type: Boolean,
    required: true,
    default: false,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: [Gender.male, Gender.female],
    required: true,
    default: Gender.male,
  },
  profilePhoto: {
    type: String,
  },
  role: {
    type: String,
    enum: Role,
    required: true,
    default: Role.User,
  },
  accessToken: {
    type: String,
    required: true,
  },
  userStatus: {
    type: String,
    enum: UserStatus,
    default: UserStatus.WaitingValidation,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    index: true,
  },
  postLikes: {
    type: [mongoose.Schema.Types.ObjectId],
    index: true,
  },
  commentLikes: {
    type: [mongoose.Schema.Types.ObjectId],
    index: true,
  },
  //posts signales
  postReports: {
    type: [mongoose.Schema.Types.ObjectId],
    index: true,
  },
  commentReports: {
    type: [mongoose.Schema.Types.ObjectId],
    index: true,
  },
  lastLogin: {
    type: Date,
    default: Date,
  },
  created_at: {
    type: Date,
    default: Date,
  },
  updated_at: {
    type: Date,
    default: Date,
  },
});
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.isModified('password')) {
    const salt = await generateSalt();
    user['password'] = await hashPassword(user['password'], salt);
  }
  next();
});
