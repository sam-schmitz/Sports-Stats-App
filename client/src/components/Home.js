// components/Home.js
// By: Sam Schmitz

import { Link } from 'react-router-dom';
function Home() {
    return (
        <div className="Homepage">
            <h1 className="mx-auto">Welcome to the Sports Stats App: </h1>
            <hr />

            <div className="row mx-auto text-center">
                <div className="col-4 ">
                    <h3><Link to="/Sports-Stats-App/teams">Teams</Link>  </h3>
                </div>
                <div className="col-4">
                    <h3><Link to="/Sports-Stats-App/players">Players</Link>  </h3>
                </div>
                <div className="col-4">
                    <h3><Link to="/Sports-Stats-App/games">Games</Link>  </h3>
                </div>                                                
            </div>

            <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'} }>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png"
                    alt="Basketball"
                    style={{ width: '250px', height: '250px' }}
                />
            </div>

            <div className="fixed-bottom text-right">
                <p><strong>Note: </strong>The server is hosted for free so it may take up to 1 minute to load data. </p>
                <p><strong>Disclaimer: </strong>For Educational Use Only</p>
            </div>
        </div>        
    );
}

export default Home;