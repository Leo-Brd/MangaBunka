const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
