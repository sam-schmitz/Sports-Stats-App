// GamePage.js
// By: Sam Schmitz
// Displays information about a game

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function TeamStats({ teams }) {
    const [currentTeam, setCurrentTeam] = useState(teams[0]);
    const teamsNames = [teams[0].name, teams[1].name];

    return (
        <>
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <h5>Team Stats: </h5>
                    </div>
                    <div className="col-auto">
                        <h5>Teams: </h5>
                        <select
                            className="form-select"
                            value={currentTeam.name}
                            onChange={(e) => setCurrentTeam(teams.find(t => t.name === e.target.value))}
                        >
                            {teamsNames.map((team) => (
                                <option key={team} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>            
            
            <p><strong>Points: </strong>{currentTeam.points}</p>
            <p><strong>Rebounds: </strong>{currentTeam.rebounds}</p>
            <p><strong>Assists: </strong>{currentTeam.assists}</p>

            <p><strong>Field Goal %: </strong>{currentTeam.fieldGoalPct}%</p>
            <p><strong>Field Goals Made: </strong>{currentTeam.fieldGoalsMade}</p>
            <p><strong>Field Goals Attempted: </strong>{currentTeam.fieldGoalsAttempted}</p>

            <p><strong>Free Throw %: </strong>{currentTeam.freeThrowPct}%</p>
            <p><strong>Free Throws Made: </strong>{currentTeam.freeThrowsMade}</p>
            <p><strong>Free Throws Attempted: </strong>{currentTeam.freeThrowsAttempted}</p>

            <p><strong>Three Point %: </strong>{currentTeam.threePointPct}%</p>
            <p><strong>Three Point Field Goals Made: </strong>{currentTeam.threePointFieldGoalsMade}</p>
            <p><strong>Three Point Field Goals Attempted: </strong>{currentTeam.threePointFieldGoalsAttempted}</p>

            <p><strong>Average Points: </strong>{currentTeam.avgPoints}</p>
            <p><strong>Average Rebounds: </strong>{currentTeam.avgRebounds}</p>
            <p><strong>Average Assists: </strong>{currentTeam.avgAssists}</p>

            <h5><strong>Team Leaders: </strong></h5>
            <p><strong>Points Leader: </strong><Link to={`/Sports-Stats-App/players/${currentTeam.pointsLeader}`}>{currentTeam.pointsLeader}</Link></p>
            <p><strong>Rebounds Leader: </strong><Link to={`/Sports-Stats-App/players/${currentTeam.reboundsLeader}`}>{currentTeam.reboundsLeader}</Link></p>
            <p><strong>Assists Leader: </strong><Link to={`/Sports-Stats-App/players/${currentTeam.assistsLeader}`}>{currentTeam.assistsLeader}</Link></p>

            <h5><strong>Scores By Period: </strong></h5>
            <ul>
                {currentTeam.linescores.map((score, index) => (
                    <li key={index}>
                        <p>{score.period}: {score.value}</p>
                    </li>
                ))}
            </ul>
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
                    <div className='col-auto' style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {game ? (
                            <TeamStats teams={game.teams } />
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
