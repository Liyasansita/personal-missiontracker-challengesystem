import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [habits, setHabits] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [congratsMessage, setCongratsMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [showChallenges, setShowChallenges] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const habitsArray = habits.split(",").map((h) => h.trim());

    try {
      const res = await axios.post("http://localhost:5000/api/users", {
        name,
        habits: habitsArray,
      });

      setScore(res.data.score);
      setStatus(res.data.status || "");
      setUserId(res.data._id);
      setJoinedChallenges(res.data.joinedChallenges || []);
      setCompletedChallenges(res.data.completedChallenges || []);
    } catch (err) {
      console.error("Error submitting user data", err);
    }
  };

  const fetchChallenges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/challenges");
      setChallenges(res.data);
    } catch (err) {
      console.error("Error fetching challenges", err);
    }
  };

  const refreshUser = async () => {
    if (!userId) return;
    try {
      const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
      const user = userRes.data;
      setScore(user.score);
      setStatus(user.status || "");
      setJoinedChallenges(user.joinedChallenges || []);
      setCompletedChallenges(user.completedChallenges || []);
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };

  const joinChallenge = async (challengeId) => {
    if (!userId) return alert("Please submit your data first.");
    try {
      await axios.post(`http://localhost:5000/api/challenges/join/${userId}`, {
        challengeId,
      });
      await refreshUser();
    } catch (err) {
      console.error("Failed to join challenge", err);
    }
  };

  const completeChallenge = async (challengeId) => {
    if (!userId) return alert("Please submit your data first.");
    try {
      await axios.post(`http://localhost:5000/api/challenges/complete/${userId}`, {
        challengeId,
      });
      await refreshUser();
      setCongratsMessage("🎉 Congratulations on completing your task!");
      setTimeout(() => setCongratsMessage(""), 3000);
    } catch (err) {
      console.error("Failed to complete challenge", err);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="container">
      <h1>Personal Tracker + Challenge System</h1>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Habits (comma separated):</label>
        <textarea
          value={habits}
          onChange={(e) => setHabits(e.target.value)}
          placeholder="e.g., Walking, Drinking Water, Meditating"
          required
        ></textarea>

        <button type="submit">Generate Score</button>
      </form>

      {score > 0 && (
        <div className="user-info">
          <p>
            Hello, <strong>{name}</strong> — Score: {score}
          </p>
          <p>{status}</p>
        </div>
      )}

      {congratsMessage && (
        <div className="congrats-message">{congratsMessage}</div>
      )}

      <button
        onClick={() => setShowChallenges(!showChallenges)}
        className="toggle-btn"
      >
        {showChallenges ? "Hide Challenges" : "Available Challenges"}
      </button>

      {showChallenges && (
        <div>
          <h3>Available Challenges</h3>
          {challenges.length === 0 ? (
            <p>No challenges available.</p>
          ) : (
            challenges.map((challenge) => {
              const joined = joinedChallenges.includes(challenge._id);
              const completed = completedChallenges.includes(challenge._id);

              return (
                <div key={challenge._id} className="challenge-card">
                  <h4>{challenge.title}</h4>
                  <p>{challenge.description}</p>

                  {completed ? (
                    <span className="completed">✅ Completed</span>
                  ) : joined ? (
                    <>
                      <button onClick={() => completeChallenge(challenge._id)}>
                        Mark as Complete
                      </button>
                      <span className="joined">Joined</span>
                    </>
                  ) : (
                    <button onClick={() => joinChallenge(challenge._id)}>
                      Join
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default App; 
