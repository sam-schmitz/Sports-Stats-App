// GamesList.js
// By: Sam Schmitz

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function GamesList() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/games')
            .then(res => setGames(res.data))
            .catch(err => console.error('Error fetching games:', err));
        console.log(games);
    }, []);

    return (
        <div>
            <h2>NBA Games 2024-2025</h2>
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <ul>
                            {games.map(game => (
                                <li key={game._id}>
                                    <Link to={`/games/${game._id}` }>{game.date.slice(0, 10)} {game.home_team_name} vs {game.away_team_name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GamesList;
