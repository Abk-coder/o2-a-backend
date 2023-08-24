import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { handleError } from 'src/utils/error';
import { logger } from 'src/utils/logger';
import { Response } from 'express';
import { Request } from 'express';
import { UploadPostHelper } from 'src/utils/helpers/upload-post-file';
import { CreatPostDto } from './dto/create-post.dto';
import { PostService } from './posts.service';
import { PostType } from 'src/utils/enums/postsType.enum';
import { PostStatus } from 'src/utils/enums/postsStatus.enum';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('newPublicPost')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture', maxCount: 1 },
        { name: 'audio', maxCount: 2 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: UploadPostHelper.uploadDirectory,
          filename: UploadPostHelper.customFileName,
        }),
      },
    ),
  )
  async creatPublicPost(
    @Res() res,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
      audio?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
    @Body() postBody: CreatPostDto,
  ) {
    try {
      logger.info(`--POST.CREAT_PUBLIC_POST-- controller INIT`);
      const newPost = await this.postService.creatPublicPost(
        postBody,
        files?.picture,
        files?.audio,
        files?.video,
      );
      logger.info(
        `--POST.CREAT_PUBLIC_POST-- created successfully ${newPost._id}`,
      );
      return res.status(HttpStatus.CREATED).json(newPost);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Post('newPrivatePost')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture', maxCount: 1 },
        { name: 'audio', maxCount: 2 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: UploadPostHelper.uploadDirectory,
          filename: UploadPostHelper.customFileName,
        }),
      },
    ),
  )
  async createPrivatePost(
    @Res() res,
    @Req() req,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
      audio?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
    @Body() postBody: CreatPostDto,
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`--POST.CREATE_PRIVATE_POST-- controller INIT`);
      const newPrivatePost = await this.postService.creatPrivatePost(
        postBody,
        userId,
        files?.picture,
        files?.audio,
        files?.video,
      );
      logger.info(
        `--POST.CREATE_PRIVATE_POST-- created successfully ${newPrivatePost._id}`,
      );
      return res.status(HttpStatus.CREATED).json(newPrivatePost);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Patch('updatePost/:postId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'picture', maxCount: 1 },
        { name: 'audio', maxCount: 2 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: UploadPostHelper.uploadDirectory,
          filename: UploadPostHelper.customFileName,
        }),
      },
    ),
  )
  async updatePost(
    @Res() res,
    @Param('postId') postId: string,
    @Body() updatePostBody: UpdatePostDto,
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
      audio?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    try {
      logger.info(`--POST.UPDATE_POST -- CONTROLLER-- INIT ${postId}`);
      const newPostId = await this.postService.updatePost(
        updatePostBody,
        postId,
        files?.picture,
        files?.audio,
        files?.video,
      );
      logger.info(`--POST.UPDATE_POST -- -- CONTROLLER-- successfully `);
      return res.status(HttpStatus.CREATED).json(newPostId);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  // @Patch('deletePassenger/:passengerId')
  // async deletePassengerFromTravelFolder(
  //   @Res() res: Response,
  //   @Param('passengerId') passengerId: string,
  // ) {
  //   try {
  //     logger.info(
  //       `--TRAVELFOLDER.DELETE_PASSENGER_FROM_TRAVEL_FOLDER -- CONTROLLER INIT ${passengerId}`,
  //     );
  //     const passengerTracking =
  //       await this.passengerService.deletePassengerFromTravelFolder(
  //         passengerId,
  //       );
  //     logger.info(
  //       `--TRAVELFOLDER.DELETE_PASSENGER_FROM_TRAVEL_FOLDER -- CONTROLLER successfully deleted`,
  //     );
  //     return res.status(HttpStatus.OK).json({
  //       message: 'passenger deleted ok',
  //       newPassenger: passengerTracking,
  //     });
  //   } catch (error) {
  //     handleError(error);
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: error.message,
  //     });
  //   }
  // }

  // @Patch('deletePassenger/:passengerId')
  // @Roles(Role.Admin)
  // async deletePassenger(
  //   @Res() res: Response,
  //   @Param('passengerId') passengerId: string,
  // ) {
  //   try {
  //     logger.info(
  //       `--PASSENGER.DELETE_PASSENGERS -- CONTROLLER-- INIT ${passengerId}`,
  //     );
  //     const newPassenger = await this.passengerService.deletePassenger(
  //       passengerId,
  //     );
  //     logger.info(
  //       `--PASSENGER.DELETE_PASSENGERS -- CONTROLLER--  successfully `,
  //     );
  //     return res.status(HttpStatus.OK).json(newPassenger);
  //   } catch (error) {
  //     handleError(error);
  //     return res.status(error.status).json({ message: error.message });
  //   }
  // }

  @Get('postDetails/:postId')
  async getPostById(@Res() res: Response, @Param('postId') postId: string) {
    try {
      logger.info(`--POST.GET_POST_BY_ID -- CONTROLLER-- INIT ${postId}`);
      const postDetails = await this.postService.getPostById(postId);
      logger.info(`----POST.GET_POST_BY_ID -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(postDetails);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Get('allPosts/:postType')
  async getPostsByType(
    @Res() res: Response,
    @Param('postType') postType: PostType,
  ) {
    try {
      logger.info(`--POST.GET_POSTS_BY_TYPE -- CONTROLLER-- INIT ${postType}`);
      const postDetails = await this.postService.getPostsByType(postType);
      logger.info(`----POST.GET_POSTS_BY_TYPE -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(postDetails);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Get('allPosts')
  async getAllPosts(@Res() res: Response) {
    try {
      logger.info(`--POST.GET_ALL_POSTS -- CONTROLLER-- INIT `);
      const posts = await this.postService.getAllPosts();
      logger.info(`----POST.GET_ALL_POSTS -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(posts);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Get('allUserPosts/:posterId')
  async getAllUserPosts(
    @Res() res: Response,
    @Param('posterId') posterId: string,
  ) {
    try {
      logger.info(`--POST.GET_ALL_USER_POSTS -- CONTROLLER-- INIT `);
      const userPosts = await this.postService.getAllUserPosts(posterId);
      logger.info(`----POST.GET_ALL_USER_POSTS -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(userPosts);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Get('allUserPosts/:postType/:posterId')
  async getUserPostsByType(
    @Res() res: Response,
    @Param('posterId') posterId: string,
    @Param('postType') postType: PostType,
  ) {
    try {
      logger.info(`--POST.GET_ALL_USER_POSTS_BY_TYPE -- CONTROLLER-- INIT `);
      const allUserPostsByType = await this.postService.getUserPostsByType(
        posterId,
        postType,
      );
      logger.info(
        `----POST.GET_ALL_USER_POSTS_BY_TYPE -- CONTROLLER-- successfully`,
      );
      return res.status(HttpStatus.OK).json(allUserPostsByType);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Get('allUserPosts/:postStatus/:posterId')
  async getUserPostsByStatus(
    @Res() res: Response,
    @Param('posterId') posterId: string,
    @Param('postStatus') postStatus: PostStatus,
  ) {
    try {
      logger.info(`--POST.GET_ALL_USER_POSTS_BY_STATUS -- CONTROLLER-- INIT `);
      const allUserPostsByStatus = await this.postService.getUserPostsByStatus(
        posterId,
        postStatus,
      );
      logger.info(
        `----POST.GET_ALL_USER_POSTS_BY_STATUS -- CONTROLLER-- successfully`,
      );
      return res.status(HttpStatus.OK).json(allUserPostsByStatus);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Patch('deletePost/:postId')
  async deletePost(@Res() res: Response, @Param('postId') postId: string) {
    try {
      logger.info(`--POST.DELETE_POST -- CONTROLLER-- INIT `);
      const post_Id = await this.postService.deletePost(postId);
      logger.info(`----POST.DELETE_POST -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(post_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('likePost/:postId')
  async likePost(
    @Res() res: Response,
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`--POST.LIKE_POST -- CONTROLLER-- INIT `);
      const post_Id = await this.postService.likePost(postId, userId);
      logger.info(`----POST.LIKE_POST -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(post_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('unlikePost/:postId')
  async unlikePost(
    @Res() res: Response,
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`--POST.UNLIKE_POST -- CONTROLLER-- INIT `);
      const post_Id = await this.postService.unlikePost(postId, userId);
      logger.info(`----POST.UNLIKE_POST -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(post_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('reportPost/:postId')
  async reportPost(
    @Res() res: Response,
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`--POST.REPORT_POST -- CONTROLLER-- INIT `);
      const post_Id = await this.postService.reportPost(postId, userId);
      logger.info(`----POST.REPORT_POST -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(post_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('unreportPost/:postId')
  async unreportPost(
    @Res() res: Response,
    @Req() req: Request,
    @Param('postId') postId: string,
  ) {
    try {
      const userId = req['user']._id;
      logger.info(`--POST.UNREPORT_POST -- CONTROLLER-- INIT `);
      const post_Id = await this.postService.unreportPost(postId, userId);
      logger.info(`----POST.UNREPORT_POST -- CONTROLLER-- successfully`);
      return res.status(HttpStatus.OK).json(post_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
}
