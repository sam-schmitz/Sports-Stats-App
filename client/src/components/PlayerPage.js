// playerPage.js
// By: Sam Schmitz
// Displays information about a player

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PlayerPage() {
    const name = useParams().name;
    const [player, setPlayer] = useState(null);    

    useEffect(() => {
        const uriName = encodeURIComponent(name);        
        const uri = `http://localhost:5000/players/name/` + uriName;        
        axios.get(uri)
            .then(res => setPlayer(res.data))
            .catch(err => console.error('Error fetching players:', err));        
    }, [name]);


    return (
        <div className="Player Page" >
            <h1> {name}</h1>
            {player ? (
                <>
                    <p>Team: {player.team_id}</p>
                    <p>Number: {player.jersey_number}</p>
                    <p>Position: {player.position}</p>
                    <p>Height: {player.height}</p>
                    <p>Weight: {player.weight}</p>
                    <p>Nationality: {player.nationality}</p>
                    <p>Date of Birth: {player.dob}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
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
    );
}


export default PlayerPage;
