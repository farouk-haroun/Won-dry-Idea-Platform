// models/ideaSpaceModel.js
import mongoose from 'mongoose';

const ideaSpaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: { type: String },
}, { timestamps: true });

const IdeaSpace = mongoose.model('IdeaSpace', ideaSpaceSchema);
export default IdeaSpace;
