// playerPage.js
// By: Sam Schmitz
// Displays information about a player

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PlayerPage() {
    const name = useParams();
    const [player, setPlayer] = useState();

    useEffect(() => {
        axios.get(`http://localhost:5000/players/name/{name}`)
            .then(res => setPlayer(res.data))
            .catch(err => console.error('Error fetching players:', err));
    })


    return (
        <div className="Player Page" >
            <h1> {name}</h1>
            <p>Team: {player.team }</p>
            <p>Number: {player.jersey_number}</p>
            <p>Position: {player.position}</p>
            <p>Height: {player.height}</p>
            <p>Weight: {player.weight}</p>
            <p>Nationality: {player.nationality}</p>
            <p>Date of Birth: {player.dob}</p>
        </div>
    );
}

export default PlayerPage;
