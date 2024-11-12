// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  confirmationToken: { type: String },
  points: { type: Number, default: 0 },
  department: { type: String },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  createdAt: { type: Date, default: Date.now },
  interests: [String],
  skills: [String]
});

const User = mongoose.model('User', userSchema);
export default User;

