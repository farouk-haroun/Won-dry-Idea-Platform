// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // To support teams
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;

