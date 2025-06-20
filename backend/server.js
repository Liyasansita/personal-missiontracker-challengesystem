const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const challengeRoutes = require("./routes/challengeRoutes");

const app = express();
app.use(cors({
  origin: 'https://personal-missiontracker-challengesystem.onrender.com', // ✅ This is your frontend URI
  credentials: true
}));

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/personal-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

