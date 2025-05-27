// playerPage.js
// By: Sam Schmitz
// Displays information about a player

import { useParams} from 'react-router-dom';

function PlayerPage() {
    const name = useParams();


    return (
        <div className="Player Page" >
            <h1> {name}</h1>
        </div>
    );
}

export default PlayerPage;
