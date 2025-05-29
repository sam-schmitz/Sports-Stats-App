// PlayersList.js
// By: Sam Schmitz

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function PlayersList() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + '/players')
            .then(res => setPlayers(res.data))
            .catch(err => console.error('Error fetching players:', err));
    }, []);

    return (
        <div>
            <h2>NBA Players</h2>
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <ul>
                            {players.map(player => (
                                <li key={player._id}>
                                    <Link to={`/players/${player.name}`}>{player.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayersList;
