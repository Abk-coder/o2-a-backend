export interface Comment extends Document {
  postId: any;
  commenterId: any;
  text: string;
  isDeleted: boolean;
  likers: any;
  reporters: any;
  created_at: any;
  updated_at: any;
}
