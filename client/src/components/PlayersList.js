// PlayersList.js
// By: Sam Schmitz

import { useEffect, useState } from 'react';
import axios from 'axios';

function PlayersList() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/players')
            .then(res => setPlayers(res.data))
            .catch(err => console.error('Error fetching players:', err));
    }, []);

    return (
        <div>
            <h2>NBA Players</h2>
            <ul>
                {players.map(player => (
                    <li key={player._id}>
                        {player.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayersList;
