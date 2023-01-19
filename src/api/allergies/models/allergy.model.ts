import * as mongoose from 'mongoose';

export const AllergiesSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'posts',
    index: true,
    required: true,
  },
  posterId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    index: true,
    required: true,
  },
  specialistId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    index: true,
    required: true,
  },
  allergyName: {
    type: String,
    index: true,
    required: true,
  },
  clinicSigns: {
    type: [String],
  },
  description: {
    type: String,
  },
  symptoms: {
    type: [String],
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
