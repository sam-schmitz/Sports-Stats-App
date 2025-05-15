import logo from './assets/logo.svg';
import './styles/App.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const socket = io('http://localhost:5000');

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

function App() {
    socket.on('scoreUpdate', data => {
        console.log('Live update:', data);
    });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default TeamsList;
