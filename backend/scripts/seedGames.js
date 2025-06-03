// seedGames.js
// By: Sam Schmitz
// seeds the db with game data for NBA games this year

const mongoose = require('mongoose');
const axios = require('axios');
const Game = require('../models/Game');
const Team = require('../models/Team');
require('dotenv').config();

// Update to change which season is fetched
const SEASON_YEAR = '2024-2025';

const seasonDates = {
    "2024-2025": {
        start: "2024-10-22",
        end: "2025-04-14"
    },
    "2023-2024": {
        start: "2023-10-24",
        end: "2023-04-14"
    },
    "2022-2023": {
        start: "2022-10-18",
        end: "2023-04-09"
    },
    "2021-2022": {
        start: "2021-10-19",
        end: "2022-04-10"
    },
    "2020-2021": {
        start: "2020-12-22",
        end: "2021-05-16"
    },
    "2019-2020": {
        start: "2019-10-22",
        end: "2020-03-11"   //suspended due to COVID
    },
}

const fetchGames = async (startDate, endDate) => {
    const baseUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=`;  //Add a date on the end (ex: YYYYMMDD)

    const teamIdMap = await getTeamIdMap();

    const formattedGames = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Create specific url
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const formattedURL = baseUrl + `${year}${month}${day}`  // YYYYMMDD
        console.log(formattedURL);

        const subFormattedGames = await fetchGame(formattedURL, d);

        //const subFormattedGames = formatGame(game, teamIdMap);

        if (subFormattedGames !== null) {
            formattedGames.push(...subFormattedGames);
        }
    }

    return formattedGames
    
};

const fetchGame = async (url, d) => {
    //console.log(d);
    const { data } = await axios.get(url);

    if (!data.events || data.events.length === 0) {
        return null;
    }

    const events = data.events;    

    const formattedGames = [];

    for (const event of events) {

        //console.log(event.competitions[0].competitors);        //must use competitions[0] even though there will always be only 1 comp

        let winner;

        if (event.competitions[0].competitors[0].winner === true) {
            winner = event.competitions[0].competitors[0].team.displayName
        } else {
            winner = event.competitions[0].competitors[1].team.displayName
        }
        //console.log('Winner found');

        const formattedGame = {
            _id: event.id,
            sport: 'basketball',
            date: d,
            homeTeamID: event.competitions[0].competitors[0].id,
            away_team_id: event.competitions[0].competitors[1].id,
            home_team_name: event.competitions[0].competitors[0].team.displayName,
            away_team_name: event.competitions[0].competitors[1].team.displayName,
            home_score: event.competitions[0].competitors[0].score,
            away_score: event.competitions[0].competitors[1].score,
            venue: event.competitions[0].venue?.fullName || null,
            status: event.competitions[0].status.type.name,
            season: SEASON_YEAR,
            game_type: 'Regular Season',
            overtime: null,
            conferenceCompetition: event.competitions[0].conferenceCompetition,
            winner: winner
        };
        //console.log(formattedGame);
        formattedGames.push(formattedGame);
    }
    
    return formattedGames;
}

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
        home_team_id: homeTeamID,
        away_team_id: awayTeamID,
        home_team_name: homeTeam,
        away_team_name: awayTeam,
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
        console.log('Database connected');

        console.log('Fetching Games...');        
        const start = seasonDates[SEASON_YEAR].start;
        const end = seasonDates[SEASON_YEAR].end;

        const startDate = new Date(start);
        const endDate = new Date(end);
        console.log(startDate, endDate);
        const formattedGames = await fetchGames(startDate, endDate);        
        console.log('All games fetched');

        //await Game.deleteMany({ sport: 'basketball', season: SEASON_YEAR });
        //console.log("deleted old games");

        /*console.log('Inserting Games into Database');
        await Game.insertMany(formattedGames)
            .then(() => console.log('Games Inserted sucessfully'))
            .catch(err => {
                console.error('Insert error: ', err);
            });
            */
        console.log(`Seeded ${formattedGames.length} games for ${SEASON_YEAR}.`);

        //const games = await Game.find().limit(5);
        //console.log('Sample games: ', games);        

        mongoose.disconnect();
    } catch (err) {
        console.error('error seeding games:', err.message);
        process.exit(1);
    }
};

seed();
