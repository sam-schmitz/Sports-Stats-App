// components/TeamsList.js
// By: Sam Schmitz

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

const API_BASE_URL = process.env.REACT_APP_API_URL;


function SearchBar({ teams }) {
    const [query, setQuery] = useState('');
    const [teamList, setTeamList] = useState([]);
    const [pages, setPages] = useState([{ name: "Home", path: "/Sports-Stats-App/" }]);

    const fuse = new Fuse(pages, { keys: ["name"], threshold: 0.3 });
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        setTeamList(teams);

    }, [teams]);

    useEffect(() => {
        if (teamList.length > 0) {
            setPages([
                { name: "Home", path: "/Sports-Stats-App/" },
                ...teamList.map((team) => ({
                    name: team.name,
                    path: `/Sports-Stats-App/teams/${team.name}`,
                }))
            ])
        }
    }, [teamList]);

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
                <div>
                    <SearchBar teams={teams } />
                </div>
                <div className="row gx-0">
                    <div className="col-sm-6 col-md-4" style={{ marginLeft: '5px', textAlign: 'left' }} >
                        <ul>
                            {teams.map(team => (
                                <li key={team._id}>
                                    <Link to={`/Sports-Stats-App/teams/${team.name}`}>{team.name} ({team.abbreviation})</Link>
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
