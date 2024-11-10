import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  scalability: { type: Number, default: 0 },
  sustainability: { type: Number, default: 0 },
  innovation: { type: Number, default: 0 },
  impact: { type: Number, default: 0 },
  additionalComments: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  brainstormingSession: { type: mongoose.Schema.Types.ObjectId, ref: 'BrainstormingSession' },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  comments: [
    {
      text: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  feedbacks: [feedbackSchema],
  status: { type: String, enum: ['submitted', 'in-progress', 'rejected', 'accepted'], default: 'submitted' },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Idea = mongoose.model('Idea', ideaSchema);
export default Idea;