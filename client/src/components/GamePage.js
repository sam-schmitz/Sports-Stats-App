// GamePage.js
// By: Sam Schmitz
// Displays information about a game

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function TeamStats({ team }) {
    return (
        <>
            <p>{team.name}</p>
            <p><strong>Points: </strong>{team.points}</p>
            <p><strong>Rebounds: </strong>{team.rebounds}</p>
            <p><strong>Assists: </strong>{team.avgRebounds}</p>

            <p><strong>Field Goal %: </strong>{team.fieldGoalPct}%</p>
            <p><strong>Field Goals Made: </strong>{team.fieldGoalsMade}</p>
            <p><strong>Field Goals Attempted: </strong>{team.fieldGoalsAttempted}</p>

            <p><strong>Free Throw %: </strong>{team.freeThrowPct}%</p>
            <p><strong>Free Throws Made: </strong>{team.freeThrowsMade}</p>
            <p><strong>Free Throws Attempted: </strong>{team.freeThrowsAttempted}</p>

            <p><strong>Three Point %: </strong>{team.threePointPct}%</p>
            <p><strong>Three Point Field Goals Made: </strong>{team.threePointFieldGoalsMade}</p>
            <p><strong>Three Point Field Goals Attempted: </strong>{team.threePointFieldGoalsAttempted}</p>

            <p><strong>Average Points: </strong>{team.avgPoints}</p>
            <p><strong>Average Rebounds: </strong>{team.avgRebounds}</p>
            <p><strong>Average Assists: </strong>{team.avgAssists}</p>

            <p><strong>Points Leader: </strong><Link to={`/Sports-Stats-App/players/${team.pointsLeader}`}>{team.pointsLeader}</Link></p>
            <p><strong>Rebounds Leader: </strong><Link to={`/Sports-Stats-App/players/${team.reboundsLeader}`}>{team.reboundsLeader}</Link></p>
            <p><strong>Assists Leader: </strong><Link to={`/Sports-Stats-App/players/${team.assistsLeader}`}>{team.assistsLeader}</Link></p>
        </>
    );
}

function GamePage() {
    const id = useParams().id;
    const [game, setGame] = useState(null);

    useEffect(() => {
        const uriName = encodeURIComponent(id);
        const uri = API_BASE_URL + `/games/id/${uriName}`;
        console.log(uri);
        axios.get(uri)
            .then(res => setGame(res.data))
            .catch(err => console.error('Error fetching game:', err));        
    }, [id])

    return (
        <div className="Game Page">
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{marginLeft: '5px', textAlign: 'left'} } >
                        {game ? (
                            <>
                                <p><strong>Date: </strong>{game.date.slice(0, 10)}</p>
                                <p><strong>Season: </strong>{game.season}</p>
                                <p><strong>Home Team: </strong><Link to={`/Sports-Stats-App/teams/${game.home_team_name}`} > {game.home_team_name}</Link></p>
                                <p><strong>Away Team: </strong><Link to={`/Sports-Stats-App/teams/${game.away_team_name}`}> {game.away_team_name}</Link></p>
                                <p><strong>Score: </strong>{game.home_score} : {game.away_score}</p>
                                <p><strong>Winner: </strong>{game.winner}</p>
                                <p><strong>Game Type: </strong>{game.game_type}</p>                                
                                <p><strong>Conference Competition: </strong>{game.conferenceCompetition}</p>
                            </>
                        ) : (
                            <>
                                <p>Loading...</p>
                            </>
                        )}
                    </div>
                </div>
                <div className='row gx-0'>
                    <div className='col-sm-6 col-md-6' style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {game ? (
                            <TeamStats team={game.teams[0] } />
                        ) : (
                            <>
                                <p>Loading...</p>
                            </>
                        )}
                    </div>
                    <div className='col-sm-5 col-md-5' style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {game ? (
                            <TeamStats team={game.teams[1] } />
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
