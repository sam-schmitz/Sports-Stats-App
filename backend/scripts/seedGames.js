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
    // Get info about the teams from the event obj
    //console.log(event.strHomeTeam?.toLowerCase());
    const homeTeamID = teamIdMap[event.strHomeTeam?.toLowerCase()];
    const awayTeamID = teamIdMap[event.strAwayTeam?.toLowerCase()];
    if (!homeTeamID || !awayTeamID) return null;
    const homeTeam = event.strHomeTeam?.toLowerCase();
    const awayTeam = event.strAwayTeam?.toLowerCase();

    //extract game_type
    let gameType = 'Regular Season';
    if (event.strDescriptionEN?.toLowerCase().includes('playoff')) {
        gameType = 'Playoffs';
    }

    //Infer overtime (basic game)
    let overtime = null;
    const statusText = event.strDescriptionEN || event.strStatus || '';
    const otMatch = statusText.match(/(\d?OT)/i);
    if (otMatch) {
        overtime = otMatch[1].toUpperCase();
    }

    return {
        _id: event.idEvent,
        sport: 'basketball',
        date: event.dateEvent ? new Date(event.dateEvent) : null,
        //home_team_id: homeTeamID,
        //away_team_id: awayTeamID,
        home_team: homeTeam,
        away_team: awayTeam,
        home_score: event.intHomeScore != null ? parseInt(event.intHomeScore) : null,
        away_score: event.intAwayScore != null ? parseInt(event.intAwayScore) : null,
        venue: event.strVenue,
        status: event.strStatus,
        season: SEASON_YEAR,
        game_type: gameType,
        overtime: overtime
    };
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await fetchGames();
        const teamIdMap = await getTeamIdMap();

        const games1 = await Game.find().limit(5);
        console.log('Sample games: ', games1);        

        await Game.deleteMany({ sport: 'basketball', season: SEASON_YEAR });
        console.log("deleted old games");

        const formattedGames = events
            .map(event => formatGame(event, teamIdMap))
            .filter(game => game !== null);
        //console.log(formattedGames[0]);        

        await Game.insertMany(formattedGames)
            .then(() => console.log('Games inserted successfully'))
            .catch(err => {
                console.error('Insert error:', err);
            });

        console.log(`Seeded ${formattedGames.length} games for ${SEASON_YEAR}.`);

        const games = await Game.find().limit(5);
        console.log('Sample games: ', games);        

        mongoose.disconnect();
    } catch (err) {
        console.error('error seeding games:', err.message);
        process.exit(1);
    }
};

seed();
