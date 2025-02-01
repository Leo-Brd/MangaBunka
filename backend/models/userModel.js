import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashé en BDD
  profilePic: { type: String, default: "https://i.pravatar.cc/150?u=default" },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    level: { type: Number, default: 1 }
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
