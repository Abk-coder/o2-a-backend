import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleError } from 'src/utils/error';
import { FileService } from 'src/services/file/file.service';
import { Post } from './interfaces/posts.interface';
import { CreatPostDto } from './dto/create-post.dto';
import { PostStatus } from 'src/utils/enums/postsStatus.enum';
import { AllergiesFileService } from '../allergies-file/allergies-file.service';
import { CreatAllergiesFileDto } from '../allergies-file/dto/create-allergies-file.dto';
import { PostType } from 'src/utils/enums/postsType.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private postModel: Model<Post>,
    private fileService: FileService,
    private usersService: UsersService,
    private allergiesFileService: AllergiesFileService,
  ) {}

  async creatPublicPost(
    creatPostDto: CreatPostDto,
    picture: Express.Multer.File[],
    audio: Express.Multer.File[],
    video: Express.Multer.File[],
  ) {
    try {
      const newPost = new this.postModel(creatPostDto);
      newPost.created_at = new Date();
      if (picture?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(picture[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading picture',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        newPost.picture = filename;
      }
      if (audio?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(audio[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading audio',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        newPost.audio = filename;
      }
      if (video?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(video[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading video',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        newPost.video = filename;
      }
      await newPost.save();
      return newPost;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async creatPrivatePost(
    creatPostDto: CreatPostDto,
    userId: string,
    picture: Express.Multer.File[],
    audio: Express.Multer.File[],
    video: Express.Multer.File[],
  ) {
    try {
      const newPost = new this.postModel(creatPostDto);
      newPost.created_at = new Date();
      if (picture?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(picture[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading picture',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        newPost.picture = filename;
      }
      if (audio?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(audio[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading audio',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        newPost.audio = filename;
      }
      if (video?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(video[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading video',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        newPost.video = filename;
      }
      newPost.postType = PostType.PRIVATE;
      await newPost.save();
      const creatAllergiesFileDto: CreatAllergiesFileDto = {
        postId: newPost._id,
        patientId: userId,
        specialistId: undefined,
      };
      await this.allergiesFileService.createFile(creatAllergiesFileDto);
      return newPost;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    postId: string,
    picture: Express.Multer.File[],
    audio: Express.Multer.File[],
    video: Express.Multer.File[],
  ) {
    try {
      const post = await this.postModel.findOne({
        _id: postId,
        postStatus: PostStatus.PostValidated,
      });
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      if (picture?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(picture[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading picture',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        post.picture = filename;
      }
      if (audio?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(audio[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading audio',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        post.audio = filename;
      }
      if (video?.length > 0) {
        const filename = await this.fileService.uploadSingleFile(video[0]);
        if (!filename)
          throw new HttpException(
            'Error uploading video',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        post.video = filename;
      }
      post.text = updatePostDto.text ? updatePostDto.text : post.text.trim();
      post.created_at = new Date();
      await post.save();
      return post._id;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getPostById(postId: string) {
    try {
      const post = await this.postModel
        .findOne({ _id: postId, postStatus: PostStatus.PostValidated })
        .exec();
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getPostsByType(postType: PostType) {
    try {
      const post = await this.postModel
        .find({ postType, postStatus: PostStatus.PostValidated })
        .exec();
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async getAllPosts() {
    try {
      const allPosts = await this.postModel
        .find({ postStatus: PostStatus.PostValidated })
        .exec();
      if (!allPosts) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      return allPosts;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async getAllUserPosts(posterId: string) {
    try {
      const allUserPosts = await this.postModel
        .find({ posterId, postStatus: PostStatus.PostValidated })
        .exec();
      if (!allUserPosts) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      return allUserPosts;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async getUserPostsByType(posterId: string, postType: PostType) {
    try {
      const allPostsByType = await this.postModel
        .find({
          posterId,
          postType,
          postStatus: PostStatus.PostValidated,
        })
        .exec();
      if (!allPostsByType) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      return allPostsByType;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async getUserPostsByStatus(posterId: string, postStatus: PostStatus) {
    try {
      const allPostsByStatus = await this.postModel
        .find({
          posterId,
          postStatus,
        })
        .exec();
      if (!allPostsByStatus) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      return allPostsByStatus;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async deletePost(postId: string) {
    try {
      const post = await this.postModel.findOne({
        _id: postId,
        postStatus: PostStatus.PostValidated,
      });
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      post.postStatus = PostStatus.Deleted;
      await post.save();
      return post._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async likePost(postId: string, likerId: string) {
    try {
      const post = await this.postModel.findOneAndUpdate(
        {
          _id: postId,
          postStatus: PostStatus.PostValidated,
        },
        {
          $addToSet: { likers: likerId },
        },
        { new: true },
      );
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      await this.usersService.likePost(postId, likerId);
      await post.save();
      return post._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async unlikePost(postId: string, likerId: string) {
    try {
      const post = await this.postModel.findOneAndUpdate(
        {
          _id: postId,
          postStatus: PostStatus.PostValidated,
        },
        {
          $pull: { likers: likerId },
        },
        { new: true },
      );
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      await this.usersService.unlikePost(postId, likerId);
      await post.save();
      return post._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async reportPost(postId: string, likerId: string) {
    try {
      const post = await this.postModel.findOneAndUpdate(
        {
          _id: postId,
          postStatus: PostStatus.PostValidated,
        },
        {
          $addToSet: { reporters: likerId },
        },
        { new: true },
      );
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      await this.usersService.reportPost(postId, likerId);
      await post.save();
      return post._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async unreportPost(postId: string, likerId: string) {
    try {
      const post = await this.postModel.findOneAndUpdate(
        {
          _id: postId,
          postStatus: PostStatus.PostValidated,
        },
        {
          $pull: { reporters: likerId },
        },
        { new: true },
      );
      if (!post) {
        throw new HttpException('Post introuvable!', HttpStatus.NOT_FOUND);
      }
      await this.usersService.unreportPost(postId, likerId);
      await post.save();
      return post._id;
    } catch (error) {
      handleError(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
