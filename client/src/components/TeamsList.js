// components/TeamsList.js
// By: Sam Schmitz

import { useEffect, useState } from 'react';
import axios from 'axios';

function TeamsList() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/teams')
            .then(res => setTeams(res.data))
            .catch(err => console.error('Error fetching teams:', err));
    }, []);

    return (
        <div>
            <h2>NBA Teams</h2>
            <ul>
                {teams.map(team => (
                    <li key={team._id}>
                        {team.name} ({team.abbreviation})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TeamsList();
