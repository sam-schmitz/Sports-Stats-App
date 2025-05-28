// GamePage.js
// By: Sam Schmitz
// Displays information about a game

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GamePage() {
    const id = useParams().id;
    const [game, setGame] = useState(null);

    useEffect(() => {
        const uriName = encodeURIComponent(id);
        const uri = `http://localhost:5000/games/id/` + uriName;
        axios.get(uri)
            .then(res => setGame(res.data))
            .catch(err => console.error('Error fetching game:', err));        
    }, [id])

    return (
        <div className="Game Page">
            <div className="container mt-3">
                <div className="row">
                    <div className="col-sm-6 col-md-4 justify-content-center" >
                        {game ? (
                            <>
                                <p>Date: {game.date.slice(0, 10)}</p>
                                <p>Season: {game.season}</p>
                                <p>Home Team: {game.home_team_id}</p>
                                <p>Away Team: {game.away_team_id}</p>
                                <p>Score: {game.home_score} : {game.away_score}</p>
                                <p>Game Type: {game.game_type}</p>
                            </>
                        ) : (
                            <>
                                <p>Loading...</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GamePage;
