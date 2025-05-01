import logo from './assets/logo.svg';
import './styles/App.css';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');



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

export default App;
