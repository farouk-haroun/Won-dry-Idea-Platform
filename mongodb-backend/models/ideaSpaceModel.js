// models/ideaSpaceModel.js
import mongoose from 'mongoose';

const ideaSpaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { 
    type: String, 
    default: 'https://via.placeholder.com/150' // Default placeholder image
  },
}, { timestamps: true });

const IdeaSpace = mongoose.model('IdeaSpace', ideaSpaceSchema);
export default IdeaSpace;
