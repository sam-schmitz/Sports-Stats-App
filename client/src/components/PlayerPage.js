// playerPage.js
// By: Sam Schmitz
// Displays information about a player

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
};


function PlayedGames({games }) {
    const [currentSeason, setCurrentSeason] = useState('2024-2025');
    const seasons = ['2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];
    
    const filteredGames = games.filter(game => game.season === currentSeason);

    return (
        <>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Played Games: </h5>
                    <select
                        className="form-select w-auto"
                        value={currentSeason}
                        onChange={(e) => setCurrentSeason(e.target.value)}
                    >
                        {seasons.map((season) => (
                            <option key={season} value={season}>
                                {season}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <ul>
                        {filteredGames.length > 0 ? (
                            filteredGames.map(game => (
                                <li key={game._id}>
                                    <Link to={`/Sports-Stats-App/games/${game._id}`}>
                                        {game.date.slice(0, 10)} - {game.home_team_name} vs {game.away_team_name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                                <p>No games found for this player in {currentSeason}. </p>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
}
function PlayerStats({ stats }) {
    const [currentSeasonStats, setCurrentSeasonStats] = useState(stats.find(s => s.season === "career"));
    const seasons = ['career', '2019', '2020', '2021', '2022', '2023', '2024'];    
    
    return (
        <>
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-auto">
                        <h5>Player Stats: </h5>
                    </div>
                    <div className="col-auto">
                        <h5>Season: </h5>
                        <select
                            className="form-select"
                            value={currentSeasonStats.season}
                            onChange={(e) => setCurrentSeasonStats(stats.find(s => s.season === e.target.value))}
                        >
                            {seasons.map((season) => (
                                <option key={season} value={season}>
                                    {season === 'career'
                                        ? 'Career'
                                        : `${season}-${parseInt(season) + 1}`
                                    }
                                </option>
                            )) }
                        </select>
                    </div>
                    <div>
                        <p><strong>Points: </strong>{currentSeasonStats.avgPoints.toFixed(2)}</p>
                        <p><strong>Assists: </strong>{currentSeasonStats.avgAssists.toFixed(2)}</p>
                        <p><strong>Offenseive Rebounds: </strong>{currentSeasonStats.avgOffensiveRebounds.toFixed(2)}</p>
                        <p><strong>Field Goal %: </strong>{currentSeasonStats.fieldGoalPct.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function PlayerPage() {
    const name = useParams().name;
    const [player, setPlayer] = useState(null);    
    const [playerGames, setPlayerGames] = useState([]);

    // Gather player data from the API
    useEffect(() => {
        const uriName = encodeURIComponent(name);        
        const uri = API_BASE_URL + `/players/name/${uriName}`;        
        axios.get(uri)
            .then(res => setPlayer(res.data))
            .catch(err => console.error('Error fetching players:', err));        
    }, [name]);

    // Gather the games the player was in from the API
    useEffect(() => {        
        if (!player?._id) {
            //console.log(player._id);
            return;
        }
        
        const uri = `${API_BASE_URL}/games/player/${player._id}`;        
        axios.get(uri)
            .then(res => {                
                setPlayerGames(res.data);                
            })            
            .catch(err => console.error('Error fetching player games: ', err));                
    }, [player?._id]);

    const [activeTab, setActiveTab] = useState('stats');


    return (
        <div className="Player Page" >
            <h1> {name}</h1>
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {player ? (
                            <>
                                <p><strong>Team: </strong><Link to={`/Sports-Stats-App/teams/${player.team_name}`}>{player.team_name}</Link></p>
                                <p><strong>Number: </strong>{player.jersey_number}</p>
                                <p><strong>Position: </strong>{player.position}</p>
                                <p><strong>Height: </strong>{formatHeight(player.height)}</p>
                                <p><strong>Weight: </strong>{player.weight} lbs</p>
                                <p><strong>Nationality: </strong>{player.nationality}</p>
                                <p><strong>Date of Birth: </strong>{player.dob.slice(0, 10)}</p>
                                <p><strong>Age: </strong>{player.age}</p>
                                <p><strong>Salary: </strong>${player.salary}</p>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div className="col-sm-5 col-md-4" style={{ marginLeft: '5px', textAlign: 'center' }} >
                        {player ? (
                            <>
                                <img src={player.photoUrl} alt={name } width="200" />
                            </>
                        ) : (
                            <>
                                <p>Loading Image...</p>
                            </>
                        )}
                    </div>
                </div>
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Player Stats
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'games' ? 'active' : ''}`}
                            onClick={() => setActiveTab('games')}
                        >
                            Played Games
                        </button>
                    </li>
                </ul> 
                <div className='row gx-0'>
                    <div className='col-12' style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {player ? (
                            activeTab === 'stats' ? (
                                <PlayerStats stats={player.seasonStats} />
                            ) : (
                                <PlayedGames games={playerGames} />
                            )
                        ) : (
                            <>
                                <p>Loading Stats...</p>
                            </>
                        )}
                    </div>
                </div>                
            </div>            
        </div>
    );
}


export default PlayerPage;
