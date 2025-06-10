
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  habits: [String],
  score: Number,
  challenges: [String], 
  joinedChallenges: [String],
  completedChallenges: [String],
});

module.exports = mongoose.model("User", userSchema);

