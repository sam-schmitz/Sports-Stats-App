// GamesList.js
// By: Sam Schmitz

import { useEffect, useState } from 'react';
import axios from 'axios';

function GamesList() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/games')
            .then(res => setGames(res.data))
            .catch(err => console.error('Error fetching games:', err));
    }, []);

    return (
        <div>
            <h2>NBA Games 2024-2025</h2>
            <ul>
                {games.map(game => (
                    <li key={game._id}>
                        {game.date} {game.home_team} vs {game.away_team}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GamesList();
