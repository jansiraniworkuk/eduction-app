import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Maths from './Maths';
import Science from './Science';
import English from './English'; // Ensure this path is correct

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div>
        <h1>Login</h1>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter guest username" />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Maths</Link>
            </li>
            <li>
              <Link to="/science">Science</Link>
            </li>
            <li>
              <Link to="/english">English</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Maths user={user} />} />
          <Route path="/science" element={<Science />} />
          <Route path="/english" element={<English />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
