import { Document } from 'mongoose';
import { PostStatus } from 'src/utils/enums/postsStatus.enum';
import { PostType } from 'src/utils/enums/postsType.enum';

export interface Post extends Document {
  posterId: any;
  postStatus: PostStatus;
  postType: PostType;
  text: string;
  picture: string;
  video: string;
  audio: string;
  likers: any;
  reporters: any;
  created_at: any;
}
