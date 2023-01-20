import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    index: true,
    required: true,
  },
  commenterId: {
    type: mongoose.Types.ObjectId,
    index: true,
    required: true,
  },
  text: {
    type: String,
    maxlength: 500,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
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

