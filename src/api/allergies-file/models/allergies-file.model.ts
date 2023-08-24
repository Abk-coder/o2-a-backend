import * as mongoose from 'mongoose';

export const AllergiesFileSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'posts',
    index: true,
    required: true,
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    index: true,
    required: true,
  },
  specialistId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    index: true,
  },
  chatBot: {
    type: [
      {
        symptoms: [String],
        food: [String],
        environmentFactor: [String],
        domesticAnimal: [String],
        drugsTook: [String],
        timestamp: Number,
      },
    ],
    required: true,
  },
  chat: {
    type: [
      {
        userChat: String,
        specialistChat: String,
        timestamp: Number,
      },
    ],
    required: true,
  },
  specialistView: {
    type: String,
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
