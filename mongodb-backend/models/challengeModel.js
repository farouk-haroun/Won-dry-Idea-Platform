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
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'closed', 'DRAFT', 'archive'], default: 'open' },
  thumbnailUrl: { type: String },  // Use a string to store the file path or URL
  category: {
    type: String,
    enum: ['SUSTAINABILITY', 'SOCIAL INNOVATION', 'TECHNOLOGY', 'HEALTHCARE', 'EDUCATION'],
    required: true,
  },
  viewCounts: { type: Number, default: 0 },
  ideaSpace: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'IdeaSpace',
    required: false
  }
}, {
  timestamps: true
});

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;

