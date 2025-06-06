// GamePage.js
// By: Sam Schmitz
// Displays information about a game

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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
                            <>
                                <p>{game.teams[0].name}</p>
                                <p><strong>Points: </strong>{game.teams[0].points}</p>
                                <p><strong>Rebounds: </strong>{game.teams[0].rebounds}</p>
                                <p><strong>Assists: </strong>{game.teams[0].avgRebounds}</p>

                                <p><strong>Field Goal %: </strong>{game.teams[0].fieldGoalPct}%</p>
                                <p><strong>Field Goals Made: </strong>{game.teams[0].fieldGoalsMade}</p>
                                <p><strong>Field Goals Attempted: </strong>{game.teams[0].fieldGoalsAttempted}</p>
                                
                                <p><strong>Free Throw %: </strong>{game.teams[0].freeThrowPct}%</p>                                
                                <p><strong>Free Throws Made: </strong>{game.teams[0].freeThrowsMade}</p>
                                <p><strong>Free Throws Attempted: </strong>{game.teams[0].freeThrowsAttempted}</p>

                                <p><strong>Three Point %: </strong>{game.teams[0].threePointPct}%</p>
                                <p><strong>Three Point Field Goals Made: </strong>{game.teams[0].threePointFieldGoalsMade}</p>
                                <p><strong>Three Point Field Goals Attempted: </strong>{game.teams[0].threePointFieldGoalsAttempted}</p>
                                
                                <p><strong>Average Points: </strong>{game.teams[0].avgPoints}</p>
                                <p><strong>Average Rebounds: </strong>{game.teams[0].avgRebounds}</p>
                                <p><strong>Average Assists: </strong>{game.teams[0].avgAssists}</p>                                

                            </>
                        ) : (
                            <>
                                <p>Loading...</p>
                            </>
                        )}
                    </div>
                    <div className='col-sm-5 col-md-5' style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {game ? (
                            <>
                                <p>{game.teams[1].name}</p>
                                
                                <p><strong>Points: </strong>{game.teams[1].points}</p>
                                <p><strong>Rebounds: </strong>{game.teams[1].rebounds}</p>
                                <p><strong>Assists: </strong>{game.teams[1].avgRebounds}</p>

                                <p><strong>Field Goal %: </strong>{game.teams[1].fieldGoalPct}%</p>
                                <p><strong>Field Goals Made: </strong>{game.teams[1].fieldGoalsMade}</p>
                                <p><strong>Field Goals Attempted: </strong>{game.teams[1].fieldGoalsAttempted}</p>

                                <p><strong>Free Throw %: </strong>{game.teams[1].freeThrowPct}%</p>
                                <p><strong>Free Throws Made: </strong>{game.teams[1].freeThrowsMade}</p>
                                <p><strong>Free Throws Attempted: </strong>{game.teams[1].freeThrowsAttempted}</p>

                                <p><strong>Three Point %: </strong>{game.teams[1].threePointPct}%</p>
                                <p><strong>Three Point Field Goals Made: </strong>{game.teams[1].threePointFieldGoalsMade}</p>
                                <p><strong>Three Point Field Goals Attempted: </strong>{game.teams[1].threePointFieldGoalsAttempted}</p>

                                <p><strong>Average Points: </strong>{game.teams[1].avgPoints}</p>
                                <p><strong>Average Rebounds: </strong>{game.teams[1].avgRebounds}</p>
                                <p><strong>Average Assists: </strong>{game.teams[1].avgAssists}</p>                                
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
