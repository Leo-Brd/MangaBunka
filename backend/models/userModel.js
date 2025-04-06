const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return this.authMethod === 'local'; } 
  },
  profilePic: { type: String, default: '' },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true
  },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }
  },
  authMethod: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
