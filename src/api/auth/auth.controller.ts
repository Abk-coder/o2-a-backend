import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { logger } from '../../utils/logger/index';
import { handleError } from 'src/utils/error';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/signin')
  async signIn(@Res() res: Response, @Body() loginData: AuthCredentialsDto) {
    try {
      logger.info(`signin.controller ${loginData.email}`);
      const userData = await this.authService.loginUser(loginData);
      return res.status(HttpStatus.CREATED).json(userData);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Post('signup')
  async signUp(@Res() res: Response, @Body() createUserDTO: CreateUserDto) {
    try {
      logger.info(`signup.controller ${createUserDTO.email}`);
      const newUser = await this.authService.addUser(createUserDTO);
      logger.info(`signup.controller ${createUserDTO.email}----SUCCESS`);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      handleError(error);
      console.log(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Post('/signout')
  async signOut(@Res() res: Response, @Req() req: Request) {
    try {
      req['user'].tokens = req['user'].tokens.filter(
        (token: { token: any }) => token.token !== req['token'],
      );
      await req['user'].save();
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Utilisateur deconnecté avec succès' });
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
}
