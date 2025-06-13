// PlayersList.js
// By: Sam Schmitz

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function SearchBar({ players }) {
    const [query, setQuery] = useState('');
    const [playerList, setPlayerList] = useState([]);
    const [pages, setPages] = useState([{ name: "Home", path: "/Sports-Stats-App/" }]);

    const fuse = new Fuse(pages, { keys: ["name"], threshold: 0.3 });
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {        
        setPlayerList(players);                           

    }, [players]);

    useEffect(() => {
        if (playerList.length > 0) {
            setPages([
                { name: "Home", path: "/Sports-Stats-App/" },
                ...playerList.map((player) => ({
                    name: player.name,
                    path: `/Sports-Stats-App/players/${player.name}`,
                }))
            ])
        }
    }, [playerList]);

    useEffect(() => {
        if (query) {
            setSuggestions(fuse.search(query).map((result) => result.item));
        } else {
            setSuggestions([]);
        }
        setSelectedIndex(-1);
    }, [query]);

    const handleSelect = (path) => {
        navigate(path);
        setQuery("")
        setSuggestions([]);
    }

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            handleSelect(suggestions[selectedIndex].path);
        } else if (e.key === "Escape") {
            setSuggestions([]);
        }
    };

    return (
        <div className="searchbar-container" style={{ position: "relative" }}>
            <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: "200px", padding: "8px" }}
            />
            {suggestions.length > 0 && (
                <ul className="dropdown" style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    width: "100%",
                    background: "white",
                    border: "1px solid #ccc",
                    listStyle: "none",
                    padding: "0",
                    margin: "0",
                    zIndex: "1000"
                }}>
                    {suggestions.map((page, index) => (
                        <li
                            key={page.path}
                            onClick={() => handleSelect(page.path)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                background: index === selectedIndex ? "#ddd" : "white"
                            }}
                        >
                            {page.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function PlayersList() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get(API_BASE_URL + '/players')
            .then(res => setPlayers(res.data))
            .catch(err => console.error('Error fetching players:', err));
    }, []);

    return (
        <div>
            <h2>NBA Players: </h2>
            <div className="container-fluid">
                <div>
                    <SearchBar players={players } />
                </div>
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <ul>
                            {players.map(player => (
                                <li key={player._id}>
                                    <Link to={`/Sports-Stats-App/players/${player.name}`}>{player.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayersList;
