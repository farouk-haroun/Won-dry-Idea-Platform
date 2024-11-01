// models/teamModel.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Renamed from senderId for clarity
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users in the team
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }], // Challenges the team is involved in
  messages: [messageSchema],  // Array of messages within the team
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the team
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Team = mongoose.model('Team', teamSchema);
export default Team;


