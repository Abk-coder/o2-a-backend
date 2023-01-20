import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Comment } from './interfaces/comment.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { handleError } from 'src/utils/error';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<Comment>,
    private usersService: UsersService,
  ) {}

  async createComment(commenterId: string, createCommentDto: CreateCommentDto) {
    try {
      const newComment = new this.commentModel(createCommentDto);
      newComment.commenterId = commenterId;
      newComment.created_at = new Date();
      await newComment.save();
      return newComment;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.commentModel.findByIdAndUpdate(
        commentId,
        {
          text: updateCommentDto.text,
        },
        { new: true },
      );
      if (!comment) {
        throw new HttpException(
          'Commentaire introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      comment.updated_at = new Date();
      await comment.save();
      return comment._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async getCommentsByPost(postId: string) {
    try {
      const comments = await this.commentModel.find({ postId });
      if (!comments) {
        throw new HttpException(
          'Commentaire introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      return comments;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async deleteComment(commentId: string) {
    try {
      const comment = await this.commentModel.findOne({
        _id: commentId,
        is_deleted: false,
      });
      if (!comment) {
        throw new HttpException(
          'Commentaire introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      comment.isDeleted = true;
      await comment.save();
      return comment._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async likeComment(commentId: string, likerId: string) {
    try {
      const comment = await this.commentModel.findOneAndUpdate(
        {
          _id: commentId,
          isDeleted: false,
        },
        {
          $addToSet: { likers: likerId },
        },
        { new: true },
      );
      if (!comment) {
        throw new HttpException('Comment introuvable!', HttpStatus.NOT_FOUND);
      }
      await this.usersService.likeComment(commentId, likerId);
      await comment.save();
      return comment._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async unlikeComment(commentId: string, unlikerId: string) {
    try {
      const comment = await this.commentModel.findOneAndUpdate(
        {
          _id: commentId,
          isDeleted: false,
        },
        {
          $pull: { likers: unlikerId },
        },
        { new: true },
      );
      if (!comment) {
        throw new HttpException(
          'Commentaire introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersService.unlikeComment(commentId, unlikerId);
      await comment.save();
      return comment._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async reportComment(commentId: string, reporterId: string) {
    try {
      const comment = await this.commentModel.findOneAndUpdate(
        {
          _id: commentId,
          isDeleted: false,
        },
        {
          $addToSet: { reporters: reporterId },
        },
        { new: true },
      );
      if (!comment) {
        throw new HttpException(
          'Commentaire introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersService.reportComment(commentId, reporterId);
      await comment.save();
      return comment._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async unreportComment(commentId: string, unreporterId: string) {
    try {
      const comment = await this.commentModel.findOneAndUpdate(
        {
          _id: commentId,
          isDeleted: false,
        },
        {
          $pull: { reporters: unreporterId },
        },
        { new: true },
      );
      if (!comment) {
        throw new HttpException(
          'Commentaire introuvable!',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.usersService.unreportComment(commentId, unreporterId);
      await comment.save();
      return comment._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
