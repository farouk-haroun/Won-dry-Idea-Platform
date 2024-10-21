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
  attachedFiles: [{ type: String }], // URLs to attached files like guidebooks
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  thumbnailUrl: { type: String },
});

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
