import logo from './assets/logo.svg';
import './styles/App.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';

const socket = io('http://localhost:5000');

function TeamsList() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/teams')
            .then(res => setTeams(res.data))
            .catch(err => console.error('Error fetching teams:', err));
    }, []);

    return (
        <div>
            <h2>NBA Teams</h2>
            <ul>
                {teams.map(team => (
                    <li key={team._id}>
                        {team.name} ({team.abbreviation})
                    </li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    socket.on('scoreUpdate', data => {
        console.log('Live update:', data);
    });

    return (
        <Router>
            <nav style={{ marginBottom: '1rem' }}>
                <Link to="/">Home</Link> |{" "}
                <Link to="/teams">Teams</Link> |{" "}
                <Link to="/players">Players</Link> |{" "}
                <Link to="/games">Games</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teams" element={<TeamsList />} />
                <Route path="/players" element={<PlatersList />} />
                <Route path="/games" element={<GamesList />} />
            </Routes>
        </Router>
    );
  
}

export default App;
