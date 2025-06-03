// App.js
// By: Sam Schmitz
// Handles the routing for the front end

import './styles/App.css';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import TeamsList from './components/TeamsList';
import PlayersList from './components/PlayersList';
import GamesList from './components/GamesList';
import PlayerPage from './components/PlayerPage';
import TeamPage from './components/TeamPage';
import GamePage from './components/GamePage';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const socket = io(API_BASE_URL);

function App() {
    socket.on('scoreUpdate', data => {
        console.log('Live update:', data);
    });

    return (
        <Router>
            <nav style={{ marginBottom: '1rem' }}>
                <Link to="/Sports-Stats-App">Home</Link> |{" "}
                <Link to="/Sports-Stats-App/teams">Teams</Link> |{" "}
                <Link to="/Sports-Stats-App/players">Players</Link> |{" "}
                <Link to="/Sports-Stats-App/games">Games</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Sports-Stats-App" element={<Home />} />
                <Route path="/Sports-Stats-App/teams" element={<TeamsList />} />
                <Route path="/Sports-Stats-App/players" element={<PlayersList />} />
                <Route path="/Sports-Stats-App/games" element={<GamesList />} />
                <Route path="/Sports-Stats-App/players/:name" element={<PlayerPage />} />
                <Route path="/Sports-Stats-App/teams/:name" element={<TeamPage />} />
                <Route path="/Sports-Stats-App/games/:id" element={<GamePage /> } />
            </Routes>
        </Router>
    );
  
}

export default App;
