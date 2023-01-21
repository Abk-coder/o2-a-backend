import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/interfaces/user.interface';
import { handleError } from 'src/utils/error/index';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { validatePassword } from '../../utils/helpers/bcrypt';
import { logger } from '../../utils/logger/index';
import { UserStatus } from 'src/utils/enums/userStatus.enum';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  publicKey = this.configService.get<string>('publicKey');
  privateKey = this.configService.get<string>('privateKey');
  signOptions = {
    algorithm: this.configService.get<string>('jwtAlgorithm'),
  };
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async addUser(userData: CreateUserDto) {
    try {
      // userData = await cryptUserData(userData);
      const user = await this.userModel.findOne({
        $or: [{ email: userData.email }],
      });
      if (user) {
        throw new HttpException(
          'Cet utilisateur existe déjà',
          HttpStatus.CONFLICT,
        );
      }
      const newUser = new this.userModel(userData);
      newUser.accessToken = await this.generateAuthToken(newUser._id);
      await newUser.save();
      return {
        userId: newUser._id,
        accesToken: newUser.accessToken,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // generateCode(): string {
  //   const SMSCode = Math.floor(100000 + Math.random() * 900000); //code à 6 chiffres
  //   return SMSCode.toString();
  // }

  async loginUser(loginData: AuthCredentialsDto) {
    try {
      const user = await this.userModel
        .findOne({ username: loginData.username })
        .exec();
      if (!user) {
        throw new HttpException(
          'Aucun utilisateur trouvé',
          HttpStatus.NOT_FOUND,
        );
      }
      if (user.userStatus !== UserStatus.AccountValidated) {
        throw new HttpException(
          "Votre compte n'est pas actif, veuillez confirmer votre mail.",
          HttpStatus.FORBIDDEN,
        );
      }
      const isMatch = await validatePassword(loginData.password, user.password);
      if (!isMatch) {
        throw new HttpException('Mot de passe invalide', HttpStatus.FORBIDDEN);
      }
      user.accessToken = this.generateAuthToken(user._id);
      user.lastLogin = new Date();
      await user.save();
      return {
        userId: user._id,
        accessToken: user.accessToken,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        address: user.address,
        role: user.role,
        profilePhoto: user.profilePhoto,
        passwordIsForgot: user.passwordIsForgot,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  /**
   *
   * @param requestToken
   * @returns
   */
  async validateToken(requestToken: string) {
    const user = await this.userModel.findOne({
      accessToken: requestToken,
    });
    if (!user) {
      throw new UnauthorizedException('Your token is invalid');
    }
    return jwt.verify(
      requestToken,
      this.publicKey,
      { algorithms: [this.configService.get<string>('jwtAlgorithm')] },
      (error: { name: string }, payload: { _id: any }) => {
        if (!error) {
          logger.info(`AuthService.service ${JSON.stringify(payload)}`);
          const userId = payload._id;
          return { userId: userId };
        } else {
          if (error.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Your token has expired');
          }
          if (error.name === 'JsonWebTokenError') {
            throw new UnauthorizedException('That JWT is malformed');
          }
        }
      },
    );
  }

  generateAuthToken = (userId: { toString: () => any }): string => {
    return jwt.sign(
      {
        _id: userId.toString(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      }, // 8 hours
      this.privateKey,
      this.signOptions,
    );
  };

  async findUserById(id: any) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new HttpException(
          'Utilisateur introuvable',
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      handleError(error);
      throw new HttpException(
        'Erreur interne du serveur',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
