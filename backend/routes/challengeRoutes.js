const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Challenge = require("../models/Challenge");


router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newChallenge = new Challenge({ title, description, participants: [] });
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/join/:userId", async (req, res) => {
  try {
    const { challengeId } = req.body;
    const user = await User.findById(req.params.userId);
    const challenge = await Challenge.findById(challengeId);

    if (!user.joinedChallenges.includes(challengeId)) {
      user.joinedChallenges.push(challengeId);
    }

    if (!challenge.participants.includes(user._id)) {
      challenge.participants.push(user._id);
    }

    await user.save();
    await challenge.save();

    res.json({ user, challenge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/complete/:userId", async (req, res) => {
  try {
    const { challengeId } = req.body;
    const user = await User.findById(req.params.userId);

    if (
      user.joinedChallenges.includes(challengeId) &&
      !user.completedChallenges.includes(challengeId)
    ) {
      user.completedChallenges.push(challengeId);
    }

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Challenge.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.json({ message: "Challenge deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

