// TeamPage.js
// By: Sam Schmitz
// Displays information about a team

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TeamPage() {
    const name = useParams().name;
    const [team, setTeam] = useState(null);

    useEffect(() => {
        const uriName = encodeURIComponent(name);
        const uri = `http://localhost:5000/teams/name/` + uriName;
        axios.get(uri)
            .then(res => setTeam(res.data))
            .catch(err => console.error('Error fetching team:', err));        
    }, [name])

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
        </div>
    );
}

export default TeamPage;
