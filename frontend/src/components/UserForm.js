import React, { useState } from 'react';
import axios from 'axios';

function UserForm({ onUserCreated }) {
  const [name, setName] = useState('');
  const [habits, setHabits] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const habitsArray = habits.split(',').map(h => h.trim());
    const res = await axios.post("http://localhost:5000/api/users", { name, habits: habitsArray });
    onUserCreated(res.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Habits (comma-separated)" value={habits} onChange={e => setHabits(e.target.value)} />
      <button type="submit">View Wellness Score</button>
    </form>
  );
}

export default UserForm;
