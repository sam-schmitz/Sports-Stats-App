// GamesList.js
// By: Sam Schmitz

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from "fuse.js";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function SearchBar({ games, onSearch }) {
    const [query, setQuery] = useState('');
    const [gamesList, setGamesList] = useState([]);
    const [pages, setPages] = useState([{ name: "Home", path: "/Sports-Stats-App/" }]);
    const [teamsList, setTeamsList] = useState([]);

    const fuse = new Fuse([...teamsList, ...pages, 2025, 2024, 2023, 2022, 2021, 2020, 2019], { keys: ["name"], threshold: 0.3 });
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const inputRef = useRef(null);    

    // set gamesList to match games
    useEffect(() => {
        setGamesList(games);
        // maybe update fuse?
    }, [games]);

    // When gamesList is updated update pages with the games in gamesList
    useEffect(() => {
        if (gamesList.length > 0) {
            setPages([
                { name: "Home", path: "/Sports-Stats-App/" },
                ...gamesList.map((game) => ({
                    name: `${game.date.slice(0, 10)} - ${game.home_team_name} vs ${game.away_team_name}`,
                    path: `/Sports-Stats-App/games/${game._id}`
                }))
            ])
        }
    }, [gamesList]);

    // get a list of all of the teams in the database
    useEffect(() => {
        axios.get(`${API_BASE_URL}/teams`)
            .then(res => {
                const teamNames = res.data.map((team) => ({
                    name: team.name,
                    path: team.name
                }));
                setTeamsList(teamNames);
            })
            .catch(err => console.error('Error fetching teams list:', err));
    }, [])

    // When the query is updated update the suggestions
    useEffect(() => {
        if (query) {
            setSuggestions(fuse.search(query).map((result) => result.item));
        } else {
            setSuggestions([]);
        }
        setSelectedIndex(-1);
    }, [query]);

    // When a suggestion is selected take the user to the cooresponding page and reset the searchbar
    const handleSelect = (path) => {
        if (pages.some(page => page.path === path)) {            
            navigate(path);
        } else {
            onSearch(path);
        }
        setQuery("")
        setSuggestions([]);
    }

    // When a query is submitted ask GamesList to fetch from the database
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(query);
        setSuggestions([]);
    }

    // Allows the user to key through the suggestions
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
        <>
            <div className="searchbar-container" style={{ position: "relative" }}>
                <form onSubmit={handleSubmit }>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        placeholder="Search..."
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ width: "200px", padding: "8px" }}
                    />
                    <button type="submit">Search</button>
                </form>
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
        </>
    );
}

function GamesList() {
    const [games, setGames] = useState([]);

    useEffect(() => {             
        fetchGames(1);
    }, []);

    function fetchGames(page = 1, search = '') {
        if (page === 1) {
            axios.get(`${API_BASE_URL}/games?page=${page}&limit=100&search=${search}`)
                .then(res => setGames(res.data))
                .catch(err => console.error('Error fetching games:', err));
        } else {
            axios.get(`${API_BASE_URL}/games?page=${page}&limit=100&search=${search}`)
                .then(res => setGames([...games, ...res.data]))
                .catch(err => console.error('Error fetching games:', err));
        }
        
    }

    const handleSearch = (query) => {
        fetchGames(1, query);
    }

    return (
        <div>
            <h2>NBA Games: </h2>
            <div className="container-fluid">
                <div>
                    {games ? (
                        <SearchBar
                            games={games}
                            onSearch={handleSearch }
                        />
                    ) : (
                        <p>Loading Games...</p>
                    )}
                </div>
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <ul>
                            {games.map(game => (
                                <li key={game._id}>
                                    <Link to={`/Sports-Stats-App/games/${game._id}`}>
                                        {game.date.slice(0, 10)} {game.home_team_name} vs {game.away_team_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GamesList;
