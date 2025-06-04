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

function PlayerPage() {
    const name = useParams().name;
    const [player, setPlayer] = useState(null);    

    useEffect(() => {
        const uriName = encodeURIComponent(name);        
        const uri = API_BASE_URL + `/players/name/${uriName}`;        
        axios.get(uri)
            .then(res => setPlayer(res.data))
            .catch(err => console.error('Error fetching players:', err));        
    }, [name]);


    return (
        <div className="Player Page" >
            <h1> {name}</h1>
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        {player ? (
                            <>
                                <p>Team: <Link to={`/Sports-Stats-App/teams/${player.team_name}`}>{player.team_name}</Link></p>
                                <p>Number: {player.jersey_number}</p>
                                <p>Position: {player.position}</p>
                                <p>Height: {formatHeight(player.height)}</p>
                                <p>Weight: {player.weight} lbs</p>
                                <p>Nationality: {player.nationality}</p>
                                <p>Date of Birth: {player.dob.slice(0, 10)}</p>
                                <p>Age: {player.age}</p>
                                <p>Salary: ${player.salary}</p>
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
            </div>            
        </div>
    );
}


export default PlayerPage;
