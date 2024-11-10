// models/challengeModel.js
import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  stages: [
    {
      name: String,
      deadline: Date,
      submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
    },
  ],
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachedFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }], // GridFS file IDs for attached files
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  thumbnailUrl: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' }, // GridFS file ID for the thumbnail
});

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;

