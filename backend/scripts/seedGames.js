// seedGames.js
// By: Sam Schmitz
// seeds the db with game data for NBA games this year

const mongoose = require('mongoose');
const axios = require('axios');
const Game = require('../models/Game');
const Team = require('../models/Team');
require('dotenv').config();

// The NBA season ID for 2024-25 in TheSportsDB
const SEASON_YEAR = '2024-2025';
const LEAGUE_NAME = 'NBA';

const fetchGames = async () => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4387&s=${SEASON_YEAR}`;  //4387 = NBA ID
    const response = await axios.get(url);
    return response.data.events || [];
};

const getTeamIdMap = async () => {
    const teams = await Team.find({ sport: 'basketball' });
    const map = {};
    for (const team of teams) {
        map[team.name.toLowerCase()] = team._id;
    }
    return map;
}

formatGame = (event, teamIdMap) => {
    const homeTeam = teamIdMap[event.strHomeTeam?.toLowerCase()];
    const awayTeam = teamIdMap[event.strAwayTeam?.toLowerCase()];
    if (!homeTeam || !awayTeam) return null;

    return {
        _id: event.idEvent,
        sport: 'basketball',
        date: event.dateEvent ? new Date(event.dateEvent) : null,
        home_team_id: homeTeam,
        away_team_id: awayTeam,
        home_score: event.intHomeScore != null ? parseInt(event.intHomeScore) : null,
        away_score: event.intAwayScore != null ? parseInt(event.intAwayScore) : null,
        venue: event.strVenue,
        status: event.strStatus,
        season: SEASON_YEAR
    };
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await fetchGames();
        const teamIdMap = await getTeamIdMap();

        await Game.deleteMany({ sport: 'basketball', season: SEASON_YEAR });

        const formattedGames = events
            .map(event => formatGame(event, teamIdMap))
            .filter(game => game !== null);

        await Game.insertMany(formattedGames, { ordered: false });

        console.log(`Seeded ${formattedGames.length} games for ${SEASON_YEAR}.`);
        mongoose.disconnect();
    } catch (err) {
        console.error('error seeding games:', err.message);
        process.exit(1);
    }
};

seed();
