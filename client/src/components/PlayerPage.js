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
            </div>            
        </div>
    );
}


export default PlayerPage;
