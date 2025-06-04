// TeamPage.js
// By: Sam Schmitz
// Displays information about a team

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function TeamPage() {
    const name = useParams().name;
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const uriName = encodeURIComponent(name);
        const uri = API_BASE_URL + `/teams/name/${uriName}`;
        axios.get(uri)
            .then(res => setTeam(res.data))            
            .catch(err => console.error('Error fetching team:', err));              
    }, [name])

    useEffect(() => {
        if (team && team._id) {                  
            axios.get(API_BASE_URL + `/teams/id/${team._id}/players`)
                .then(res => setPlayers(res.data))
                .catch(err => console.error('Error fetching team players:', err));
        }
    }, [team]);

    return (
        <div className="TeamPage" >
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <h1>{name}</h1>
                        {team ? (
                            <>
                                <p><strong>Conference: </strong>{team.conference}</p>                 
                                <p><strong>Location: </strong>{team.location}</p>
                                <p><strong>Stadium: </strong>{team.stadium}</p>
                            </>
                        ) : (
                            <>
                                <p>Loading...</p>
                            </>
                        )}
                    </div>
                    <div className="col-sm-5 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {team ? (
                            <>
                                <img src={team.logoUrl} alt={name } width="200" />
                            </>
                        ) : (
                            <>
                                <p>Loading Image...</p>
                            </>
                        )}
                    </div>
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {players.length > 0 ? (
                            <>
                                <h3>Players</h3>
                                <ul>
                                    {players.map(player => (
                                        <li key={player._id}>
                                            <Link to={`/Sports-Stats-App/players/${player.name}` } >{player.name} - {player.position}</Link>
                                        </li>
                                    )) }
                                </ul>
                            </>
                        ) : (
                            <>
                                <p>Loading Players...</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamPage;
