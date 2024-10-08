// models/teamModel.js
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of team members
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }], // Challenges associated with the team
  createdAt: { type: Date, default: Date.now },
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
