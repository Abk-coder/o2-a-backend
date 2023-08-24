import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { handleError } from 'src/utils/error';
import { validatePassword } from 'src/utils/helpers/bcrypt';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { UserStatus } from 'src/utils/enums/userStatus.enum';
import { Role } from 'src/utils/enums/role.enum';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ChangeUserStatusByAdminDto } from './dto/change-user-status-admin.dto';
import { ChangeUserRoleByAdminDto } from './dto/change-user-role-admin.dto';
import { FileService } from 'src/services/file/file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authService: AuthService,
    private fileService: FileService,
  ) {}

  async updateUserByAdmin(
    userId: string,
    updateUserAdminDto: UpdateUserAdminDto,
  ) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password -accessToken');
      if (!user) {
        throw new HttpException(
          'Utilisateur non trouvé.',
          HttpStatus.NOT_FOUND,
        );
      }
      if (updateUserAdminDto.email) {
        const existingUser = await this.checkExistingFieldsUser(
          'email',
          updateUserAdminDto.email,
          user._id,
        );
        if (existingUser) {
          throw new HttpException(
            "L'email renseigné existe déjà .",
            HttpStatus.CONFLICT,
          );
        }
        user.email = updateUserAdminDto.email;
      }
      if (updateUserAdminDto.username) {
        const existingUser = await this.checkExistingFieldsUser(
          'username',
          updateUserAdminDto.username,
          user._id,
        );
        if (existingUser) {
          throw new HttpException(
            "Le nom d'utilisateur renseigné existe déjà .",
            HttpStatus.CONFLICT,
          );
        }
        user.username = updateUserAdminDto.username;
      }
      user.firstname = updateUserAdminDto.firstname
        ? updateUserAdminDto.firstname
        : user.firstname;
      user.lastname = updateUserAdminDto.lastname
        ? updateUserAdminDto.lastname
        : user.lastname;
      user.lastname = updateUserAdminDto.lastname
        ? updateUserAdminDto.lastname
        : user.lastname;
      user.address = updateUserAdminDto.address
        ? updateUserAdminDto.address
        : user.address;
      await user.save();
      return user._id;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getUserDetailsByAdmin(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password -accessToken -updated_at -created_at')
        .exec();
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async changeUserStatusByAdmin(
    userId: string,
    changeUserStatusByAdminDto: ChangeUserStatusByAdminDto,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable !',
          HttpStatus.NOT_FOUND,
        );
      }
      user.userStatus = changeUserStatusByAdminDto.userStatus;
      user.save();
      return user._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async changeUserRoleByAdmin(
    userId: string,
    changeUserRoleByAdminDto: ChangeUserRoleByAdminDto,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable !',
          HttpStatus.NOT_FOUND,
        );
      }
      user.role = changeUserRoleByAdminDto.role;
      user.save();
      return user._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  //password workflow
  async changePassword(
    userId: string,
    newPassword: string,
    oldPassword: string,
  ) {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      const passwordMatched = await validatePassword(
        oldPassword,
        user.password,
      );
      if (!passwordMatched) {
        throw new HttpException('Mot de passe incorrect', HttpStatus.NOT_FOUND);
      }
      user.password = newPassword;
      if (user.passwordIsForgot) user.passwordIsForgot = false;
      await user.save();
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async emailCheck(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email }).exec();
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }

      const code = 'S' + randomBytes(2).toString('hex') + 'X';
      /*user.validationCode = code;
      user.validationCodeExpirationDate = Date.now() + 120000; // 2 minutes*/
      await user.save();
      return 'Email envoyé';
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async codeVerification(email: string, code: any) {
    try {
      const user = await this.userModel
        .findOne({ email: email, validationCode: code })
        .exec();
      if (!user) {
        throw new HttpException(
          'Code invalide ou expiré',
          HttpStatus.FORBIDDEN,
        );
      }
      /*if (user.validationCodeExpirationDate.getTime() <= Date.now()) {
        throw new HttpException('code expiré', HttpStatus.FORBIDDEN);
      }*/
      const token = this.authService.generateAuthToken(user._id);
      /*user.tokens = user.tokens.concat({ token });
      user.validationCode = null;*/
      await user.save();
      return token;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select(
          '_id username firstname lastname email address role profilePhoto userStatus tokenFirebase',
        )
        .exec();
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userModel
        .find()
        .sort({ createdAt: -1 })
        .select(
          '_id firstname lastname email username address role userStatus profilePhoto',
        );
      return users;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserDto,
    profilePhoto: Express.Multer.File[],
  ) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('_id firstname lastname username email address profilePhoto');
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      user.firstname = updateData.firstname
        ? updateData.firstname
        : user.firstname;
      user.lastname = updateData.lastname ? updateData.lastname : user.lastname;
      user.address = updateData.address ? updateData.address : user.address;
      if (updateData.email) {
        const userFound = await this.checkExistingFieldsUser(
          'email',
          updateData.email,
          userId,
        );
        if (userFound) {
          throw new HttpException(
            "L'adresse email renseigné existe déjà",
            HttpStatus.CONFLICT,
          );
        }
        user.email = updateData.email;
      }
      if (updateData.username) {
        const userFound = await this.checkExistingFieldsUser(
          'username',
          updateData.username,
          userId,
        );
        if (userFound) {
          throw new HttpException(
            "Le nom d'utilisateur renseigné existe déjà",
            HttpStatus.CONFLICT,
          );
        }
        user.username = updateData.username;
      }
      if (profilePhoto?.length > 0) {
        const filePath = await this.fileService.uploadSingleFile(
          profilePhoto[0],
        );
        if (!filePath) {
          throw new HttpException(
            'Error uploading profilePhoto !',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        user.profilePhoto = filePath;
      }
      await user.save();
      return user;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async checkExistingFieldsUser(fieldName: string, value: any, userId: string) {
    let findRequest = {};
    try {
      switch (fieldName) {
        case 'username':
          findRequest = { username: value, _id: { $ne: userId } };
          break;
        case 'email':
          findRequest = { email: value, _id: { $ne: userId } };
          break;
        default:
          break;
      }
      const user = await this.userModel.findOne(findRequest).select('_id');
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getUserByRole(role: Role) {
    try {
      const users = await this.userModel
        .find({ role })
        .select('_id firstname lastname username address email profilePhoto');
      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  generatePassword() {
    let pass = '';
    const passwordLength = 8;
    const str =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';
    for (let i = 0; i < passwordLength; i++) {
      const char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    return pass;
  }

  async likePost(postId: string, userId: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          userStatus: UserStatus.AccountValidated,
        },
        {
          $addToSet: { postLikes: postId },
        },
        { new: true },
      );
      if (!user) {
        throw new HttpException('User introuvable!', HttpStatus.NOT_FOUND);
      }
      await user.save();
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async unlikePost(postId: string, userId: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          userStatus: UserStatus.AccountValidated,
        },
        {
          $pull: { postLikes: postId },
        },
        { new: true },
      );
      if (!user) {
        throw new HttpException('User introuvable!', HttpStatus.NOT_FOUND);
      }
      await user.save();
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async reportPost(postId: string, userId: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          userStatus: UserStatus.AccountValidated,
        },
        {
          $addToSet: { postReports: postId },
        },
        { new: true },
      );
      if (!user) {
        throw new HttpException('User introuvable!', HttpStatus.NOT_FOUND);
      }
      await user.save();
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async unreportPost(postId: string, userId: string) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          userStatus: UserStatus.AccountValidated,
        },
        {
          $pull: { postReports: postId },
        },
        { new: true },
      );
      if (!user) {
        throw new HttpException('User introuvable!', HttpStatus.NOT_FOUND);
      }
      await user.save();
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
