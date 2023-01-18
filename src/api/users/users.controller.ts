import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Put,
  Post,
  Req,
  Res,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { UsersService } from './users.service';
import { logger } from '../../utils/logger/index';
import { handleError } from 'src/utils/error';
import { ChangePasswordDto } from './dto/changePassword-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadProfileHelper } from 'src/utils/helpers/upload-image.helper';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ChangeUserStatusByAdminDto } from './dto/change-user-status-admin.dto';
import { ChangeUserRoleByAdminDto } from './dto/change-user-role-admin.dto';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // Admin workflow
  @Patch('updateUserByAdmin/:userId')
  @Roles(Role.Admin)
  async updateUserByAdmin(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Body() userData: UpdateUserAdminDto,
  ) {
    try {
      logger.info(`USER.CONTROLLER.UPDATE_USER_BY_ADMIN.   ----INIT.`);
      const user_Id = await this.userService.updateUserByAdmin(
        userId,
        userData,
      );
      logger.info(`USER.CONTROLLER.UPDATE_USER_BY_ADMIN.  ----SUCCESS.`);
      return res.status(HttpStatus.OK).json({
        message: 'User updated successfully !',
        userId: user_Id,
      });
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }

  @Get('userDetailsByAdmin/:userId')
  @Roles(Role.Admin)
  async getUserDetailsByAdmin(
    @Res() res: Response,
    @Param('userId') userId: string,
  ) {
    try {
      logger.info(
        `USER.CONTROLLER.GET_USER_DETAILS_BY_ADMIN ${userId}----INIT`,
      );
      const user = await this.userService.getUserDetailsByAdmin(userId);
      logger.info(
        `USER.CONTROLLER.GET_USER_DETAILS_BY_ADMIN ${userId}----SUCCESS`,
      );
      return res.status(HttpStatus.OK).json({
        message: 'user OK',
        user: user,
      });
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Patch('userStatus/:userId')
  @Roles(Role.Admin)
  async changeUserStatusByAdmin(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Body() changeUserStatusByAdminDto: ChangeUserStatusByAdminDto,
  ) {
    try {
      logger.info(
        `USER.CONTROLLER.CHANGE_USER_STATUS_BY_ADMIN ${userId}----INIT`,
      );
      const user_id = await this.userService.changeUserStatusByAdmin(
        userId,
        changeUserStatusByAdminDto,
      );
      logger.info(
        `USER.CONTROLLER.CHANGE_USER_STATUS_BY_ADMIN ${userId}----SUCCESS`,
      );
      return res.status(HttpStatus.OK).json(user_id);
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
  @Patch('userRole/:userId')
  @Roles(Role.Admin)
  async changeUserRoleByAdmin(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Body() changeUserRoleByAdminDto: ChangeUserRoleByAdminDto,
  ) {
    try {
      logger.info(
        `USER.CONTROLLER.CHANGE_USER_ROLE_BY_ADMIN ${userId}----INIT`,
      );
      const user_id = await this.userService.changeUserRoleByAdmin(
        userId,
        changeUserRoleByAdminDto,
      );
      logger.info(
        `USER.CONTROLLER.CHANGE_USER_ROLE_BY_ADMIN ${userId}----SUCCESS`,
      );
      return res.status(HttpStatus.OK).json(user_id);
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('userDetails')
  async getUserDetails(@Res() res: Response, @Req() req: Request) {
    try {
      const userId = req['user']._id;
      logger.info(`USER.CONTROLLER.GET_USER_DETAILS ${userId}----INIT`);
      const user = await this.userService.getUserById(userId);
      logger.info(`USER.CONTROLLER.GET_USER_DETAILS ${userId}----SUCCESS`);
      return res.status(HttpStatus.OK).json({
        message: 'user OK',
        user: user,
      });
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('allUsers')
  @Roles(Role.Admin)
  async getAllUsers(@Res() res) {
    try {
      logger.info(`USER.CONTROLLER.GET_ALL_USERS----INIT`);
      const users = await this.userService.getAllUsers();
      logger.info(`USER.CONTROLLER.GET_ALL_USERS----SUCCESS`);
      return res.status(HttpStatus.OK).json({
        message: 'Users OK',
        users: users,
      });
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Patch('updateUser')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePhoto', maxCount: 1 }], {
      storage: diskStorage({
        destination: UploadProfileHelper.uploadDirectory,
        filename: UploadProfileHelper.customFileName,
      }),
    }),
  )
  async updateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateData: UpdateUserDto,
    @UploadedFiles()
    files: {
      profilePhoto?: Express.Multer.File[];
    },
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`USER.CONTROLLER.UPDATE_USER ${userId}----INIT`);
      const newInfos = await this.userService.updateUser(
        userId,
        updateData,
        files?.profilePhoto,
      );
      logger.info(`USER.CONTROLLER.UPDATE_USER ${userId}----SUCCESS`);
      return res.status(HttpStatus.OK).json({
        message: 'user OK',
        user: newInfos,
      });
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  //password workflow
  @Post('changePassword')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res,
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`USERS-CONTROLLERS-CHANGE_PASSWORD ${userId}----INIT`);
      const changedPassword = await this.userService.changePassword(
        userId,
        changePasswordDto.newPassword,
        changePasswordDto.oldPassword,
      );
      logger.info(`USERS-CONTROLLERS-CHANGE_PASSWORD ${userId}----SUCCESS`);
      return res.status(HttpStatus.ACCEPTED).json({
        message: 'password changed OK',
        user: changedPassword._id,
      });
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Patch('suspendUser/:id')
  @Roles(Role.Admin)
  async suspendUser(@Res() res: Response, @Param('id') id: string) {
    try {
      logger.info(`USERS.CONTROLLER.SUSPEND_USER ${id}----INIT`);
      const user = await this.userService.suspendUser(id);
      logger.info(`USERS.CONTROLLER.SUSPEND_USER ${id}----SUCCESS`);
      return res.status(HttpStatus.ACCEPTED).json({
        message: 'User suspended OK',
        userId: user._id,
      });
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('usersByRole')
  @Roles(Role.Admin)
  async getUsersByRole(@Res() res, @Query('role') role: Role) {
    logger.info('--USER.GETUSERSBYROLE-- controller INIT');
    try {
      const users = await this.userService.getUserByRole(role);
      logger.info(`--USER.GETUSERSBYROLE-- found ${users.length}`);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      handleError(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
