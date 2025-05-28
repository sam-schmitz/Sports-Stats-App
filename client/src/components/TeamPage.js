// TeamPage.js
// By: Sam Schmitz
// Displays information about a team

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TeamPage() {
    const name = useParams().name;
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const uriName = encodeURIComponent(name);
        const uri = `http://localhost:5000/teams/name/` + uriName;
        axios.get(uri)
            .then(res => setTeam(res.data))
            .catch(err => console.error('Error fetching team:', err));      
        
    }, [name])

    useEffect(() => {
        if (team && team._id) {
            console.log(`http://localhost:5000/teams/id/${team._id}/players`)
            axios.get(`http://localhost:5000/teams/id/${team._id}/players`)
                .then(res => setPlayers(res.data))
                .catch(err => console.error('Error fetching team players:', err));
        }
    }, [team]);

    return (
        <div className="TeamPage" >
            <h1>{name}</h1>
            {team ? (
                <>
                    <p>Conference: {team.conference}</p>                 
                    <p>Location: {team.location}</p>
                    <p>Stadium: {team.stadium}</p>
                </>
            ) : (
                <>
                    <p>Loading...</p>
                </>
            )}
            {team ? (
                <>
                    <img src={team.logoUrl} alt={name } width="200" />
                </>
            ) : (
                <>
                    <p>Loading Image...</p>
                </>
            )}
            {players.length > 0 ? (
                <>
                    <h3>Players</h3>
                    <ul>
                        {players.map(player => (
                            <li key={player._id}>{player.name} - {player.position}</li>
                        )) }
                    </ul>
                </>
            ) : (
                <>
                    <p>Loading Players...</p>
                </>
            )}
        </div>
    );
}

export default TeamPage;
