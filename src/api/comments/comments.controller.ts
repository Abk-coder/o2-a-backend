import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { handleError } from 'src/utils/error';
import { logger } from 'src/utils/logger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('newComment')
  async createComment(
    @Res() res,
    @Req() req,
    @Body() commentBody: CreateCommentDto,
  ) {
    try {
      const commenterId = req['user']._id;
      logger.info(`--COMMENT.CREATE_COMMENT-- controller INIT`);
      const newComment = await this.commentsService.createComment(
        commenterId,
        commentBody,
      );
      logger.info(
        `--COMMENT.CREATE_COMMENT-- created successfully ${newComment._id}`,
      );
      return res.status(HttpStatus.CREATED).json(newComment);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Patch('updateComment/:commentId')
  async updateComment(
    @Res() res,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    try {
      logger.info(`--COMMENT.UPDATE_COMMENT -- CONTROLLER-- INIT ${commentId}`);
      const newCommentId = await this.commentsService.updateComment(
        commentId,
        updateCommentDto,
      );
      logger.info(`--COMMENT.UPDATE_COMMENT -- -- CONTROLLER-- successfully `);
      return res.status(HttpStatus.CREATED).json(newCommentId);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Get('allcommentsByPost/:postId')
  async getCommentsByPost(@Res() res, @Param('postId') postId: string) {
    try {
      logger.info(
        `--COMMENT.GET_COMMENTS_BY_POST -- CONTROLLER-- INIT ${postId}`,
      );
      const comments = await this.commentsService.getCommentsByPost(postId);
      logger.info(
        `--COMMENT.GET_COMMENTS_BY_POST -- -- CONTROLLER-- successfully `,
      );
      return res.status(HttpStatus.CREATED).json(comments);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('deleteComment/:commentId')
  async deleteComment(@Res() res, @Param('commentId') commentId: string) {
    try {
      logger.info(`--COMMENT.DELETE_COMMENT -- CONTROLLER-- INIT ${commentId}`);
      const comment_Id = await this.commentsService.deleteComment(commentId);
      logger.info(`--COMMENT.DELETE_COMMENT -- -- CONTROLLER-- successfully `);
      return res.status(HttpStatus.CREATED).json(comment_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('likeComment/:commentId')
  async likeComment(
    @Res() res,
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    try {
      const likerId = req['user']._id;
      logger.info(`--COMMENT.LIKE_COMMENT -- CONTROLLER-- INIT ${commentId}`);
      const comment_Id = await this.commentsService.likeComment(
        commentId,
        likerId,
      );
      logger.info(`--COMMENT.LIKE_COMMENT -- -- CONTROLLER-- successfully `);
      return res.status(HttpStatus.CREATED).json(comment_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('unlikeComment/:commentId')
  async unlikeComment(
    @Res() res,
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    try {
      const unlikerId = req['user']._id;
      logger.info(`--COMMENT.UNLIKE_COMMENT -- CONTROLLER-- INIT ${commentId}`);
      const comment_Id = await this.commentsService.unlikeComment(
        commentId,
        unlikerId,
      );
      logger.info(`--COMMENT.UNLIKE_COMMENT -- -- CONTROLLER-- successfully `);
      return res.status(HttpStatus.CREATED).json(comment_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('reportComment/:commentId')
  async reportComment(
    @Res() res,
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    try {
      const reporterId = req['user']._id;
      logger.info(`--COMMENT.REPORT_COMMENT -- CONTROLLER-- INIT ${commentId}`);
      const comment_Id = await this.commentsService.reportComment(
        commentId,
        reporterId,
      );
      logger.info(`--COMMENT.REPORT_COMMENT -- -- CONTROLLER-- successfully `);
      return res.status(HttpStatus.CREATED).json(comment_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
  @Patch('unreportComment/:commentId')
  async UNreportComment(
    @Res() res,
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    try {
      const unreporterId = req['user']._id;
      logger.info(
        `--COMMENT.UNREPORT_COMMENT -- CONTROLLER-- INIT ${commentId}`,
      );
      const comment_Id = await this.commentsService.unreportComment(
        commentId,
        unreporterId,
      );
      logger.info(
        `--COMMENT.UNREPORT_COMMENT -- -- CONTROLLER-- successfully `,
      );
      return res.status(HttpStatus.CREATED).json(comment_Id);
    } catch (error) {
      handleError(error);
      return res.status(error.status).json({ message: error.message });
    }
  }
}
