// components/TeamsList.js
// By: Sam Schmitz

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function TeamsList() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + '/teams')
            .then(res => setTeams(res.data))
            .catch(err => console.error('Error fetching teams:', err));
    }, []);

    return (
        <div>
            <h2>NBA Teams</h2>
            <div className="container-fluid">
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <ul>
                            {teams.map(team => (
                                <li key={team._id}>
                                    <Link to={`/teams/${team.name}`}>{team.name} ({team.abbreviation})</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamsList;
