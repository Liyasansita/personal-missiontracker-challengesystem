const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/", async (req, res) => {
  const { name, habits } = req.body;
  const score = habits.length * 10;

  const newUser = new User({ name, habits, score, challenges: [] });
  await newUser.save();

  res.json(newUser);
});


router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

