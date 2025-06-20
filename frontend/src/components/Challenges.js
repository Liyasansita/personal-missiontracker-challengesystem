import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Challenges({ user }) {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/challenges").then(res => setChallenges(res.data));
  }, []);

  const joinChallenge = async (challengeId) => {
    await axios.post("http://localhost:5000/api/challenges/join", {
      userId: user._id,
      challengeId
    });
    alert("Joined challenge!");
  };

  return (
    <div>
      <h3>Available Challenges</h3>
      {challenges.map(c => (
        <div key={c._id}>
          <strong>{c.title}</strong> - {c.description}
          <button onClick={() => joinChallenge(c._id)}>Join</button>
        </div>
      ))}
    </div>
  );
}

export default Challenges;
