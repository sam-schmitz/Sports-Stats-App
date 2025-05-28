// App.js
// By: Sam Schmitz
// Handles the routing for the front end

import './styles/App.css';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import TeamsList from './components/TeamsList';
import PlayersList from './components/PlayersList';
import GamesList from './components/GamesList';
import PlayerPage from './components/PlayerPage';
import TeamPage from './components/TeamPage';
import GamePage from './components/GamePage';

const socket = io('http://localhost:5000');

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
                <Route path="/players" element={<PlayersList />} />
                <Route path="/games" element={<GamesList />} />
                <Route path="/players/:name" element={<PlayerPage />} />
                <Route path="teams/:name" element={<TeamPage />} />
                <Route path="games/:id" element={<GamePage /> } />
            </Routes>
        </Router>
    );
  
}

export default App;
