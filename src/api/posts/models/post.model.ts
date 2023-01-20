import * as mongoose from 'mongoose';
import { PostStatus } from 'src/utils/enums/postsStatus.enum';
import { PostType } from 'src/utils/enums/postsType.enum';

export const PostsSchema = new mongoose.Schema({
  posterId: {
    type: mongoose.Types.ObjectId,
    index: true,
    required: true,
  },
  postStatus: {
    type: String,
    enum: PostStatus,
    index: true,
    required: true,
    default: PostStatus.PostValidated,
  },
  postType: {
    type: String,
    enum: PostType,
    index: true,
    required: true,
    default: PostType.PUBLIC,
  },
  text: {
    type: String,
    maxlength: 500,
  },
  picture: {
    type: String,
  },
  video: {
    type: String,
  },
  audio: {
    type: String,
  },
  likers: {
    type: [mongoose.Types.ObjectId],
  },
  reporters: {
    type: [mongoose.Types.ObjectId],
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

