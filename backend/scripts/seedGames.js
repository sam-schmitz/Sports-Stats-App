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
        end: "2025-04-13"
    },
    "2023-2024": {
        start: "2023-10-24",
        end: "2024-04-14"
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
    //console.log(`Start: ${startDate}, End: ${endDate}`);
    const baseUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=`;  //Add a date on the end (ex: YYYYMMDD)

    const teamIdMap = await getTeamIdMap();    

    const formattedGames = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Create specific url
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const formattedURL = baseUrl + `${year}${month}${day}`  // YYYYMMDD
        //console.log(formattedURL);

        const subFormattedGames = await fetchGame(formattedURL, d, teamIdMap);

        //const subFormattedGames = formatGame(game, teamIdMap);

        if (subFormattedGames !== null) {
            formattedGames.push(...subFormattedGames);
        }
    }
    //console.log(formattedGames);    
    return formattedGames;
    
};

const fetchGame = async (url, d, teamIdMap) => {
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

        const competitors = event.competitions[0].competitors;
        const home = competitors.find(c => c.homeAway === 'home');
        const away = competitors.find(c => c.homeAway === 'away');

        if (!home || !away || !home.id || !away.id) {
            console.warn(`Missing home or away team for game ${event.id}`);
            return null;
        }

        const homeTeamId = teamIdMap[home.id];
        const awayTeamId = teamIdMap[away.id];

        if (!homeTeamId || !awayTeamId) {

            console.warn(`Missing home or away team id for game ${event.id}`);
            //console.log(home);
            console.log(home.id);
            return null;
        }
        //console.log("Home Team: ", home.id, "homeTeamId", homeTeamId);
        
        const homeTeamStatSchema = getTeamStats(home, teamIdMap[home.id]);
        const awayTeamStatSchema = getTeamStats(away, teamIdMap[away.id]);    

        // Get the player stats for the game
        const playerStats = await getPlayerStats(event.id);

        const formattedGame = {
            _id: event.id,
            sport: 'basketball',
            date: d,
            home_team_id: teamIdMap[home.id],
            away_team_id: teamIdMap[away.id],
            home_team_name: home.team.displayName,
            away_team_name: away.team.displayName,
            home_score: home.score,
            away_score: away.score,
            venue: event.competitions[0].venue?.fullName || null,
            status: event.competitions[0].status.type.name,
            season: SEASON_YEAR,
            game_type: 'Regular Season',
            overtime: null,
            conferenceCompetition: event.competitions[0].conferenceCompetition,
            winner: winner,
            teams: [homeTeamStatSchema, awayTeamStatSchema],
            players: playerStats
        };
        //console.log(formattedGame);
        //console.log(`Game: ${formattedGame._id} formatted`);
        formattedGames.push(formattedGame);
    }
    
    return formattedGames;
}

getTeamStats = (team, id) => {   
    if (!team.statistics) {
        console.warn('Missing statistics');
    } else if (!team.leaders) {
        console.warn('Missing leaders');
    };
    const statMap = Object.fromEntries(
        team.statistics.map(stat => [stat.name, parseFloat(stat.displayValue)])
    );
    const leaderMap = Object.fromEntries(
        (team.leaders || []).map(leader => [leader.name, leader.leaders[0].athlete.displayName])
    );      
    const record = team.records?.find(r => r.name === "overall") || null    
    

    const formattedTeam = {
        team_id: id,
        name: team.team.displayName,
        linescores: team.linescores, // needs to be updated
        rebounds: statMap.rebounds,
        avgRebounds: statMap.avgRebounds,
        assists: statMap.assists,
        fieldGoalsAttempted: statMap.fieldGoalsAttempted,
        fieldGoalsMade: statMap.fieldGoalsMade,
        fieldGoalPct: statMap.fieldGoalPct,
        freeThrowPct: statMap.freeThrowPct,
        freeThrowsAttempted: statMap.freeThrowsAttempted,
        freeThrowsMade: statMap.freeThrowsMade,
        points: statMap.points,
        threePointPct: statMap.threePointPct,
        threePointFieldGoalsAttempted: statMap.threePointFieldGoalsAttempted,
        threePointFieldGoalsMade: statMap.threePointFieldGoalsMade,
        avgPoints: statMap.avgPoints,
        avgAssists: statMap.avgAssists,
        threePointFieldGoalPct: statMap.threePointFieldGoalPct,
        pointsLeader: leaderMap?.points || null,
        reboundsLeader: leaderMap?.rebounds || null,
        assistsLeader: leaderMap?.assists || null,
        record: record?.summary || null
    };    
    return formattedTeam;
};

const getPlayerStats = async (gameId) => {
    try {
        // get the player stats from the api
        const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`;
        const { data } = await axios.get(url);

        // gather the player stats data
        const formattedPlayers = [];

        for (const team of data.boxscore.players) {
            const teamId = team.team.id;

            for (const athlete of team.statistics[0].athletes) {
                //console.log(athlete.stats);

                if (athlete.stats.length === 0) {
                    // athelte didn't play - no stats                    
                    //console.warn(`No stats found for: ${athlete.athlete.id}`);
                    continue;
                } else if (athlete.stats[0] === '-') {
                    continue;
                }

                const [fieldGoalsMade, fieldGoalsAttempted] = athlete.stats[1].split('-').map(Number);
                let fieldGoals = 0;
                if (fieldGoalsMade !== 0) {
                    fieldGoals = fieldGoalsMade / fieldGoalsAttempted;
                }
                
                const [threePointsMade, threePointsAttempted] = athlete.stats[2].split('-').map(Number);
                let threePoints = 0;
                if (threePointsMade !== 0) {
                    threePoints = threePointsMade / threePointsAttempted;
                }                

                const [freeThrowsMade, freeThrowsAttempeted] = athlete.stats[3].split('-').map(Number);
                let freeThrows = 0;
                if (freeThrowsMade !== 0) {
                    freeThrows = freeThrowsMade / freeThrowsAttempeted;
                }                

                const formattedPlayer = {
                    player_id: athlete.athlete.id,
                    team_id: teamId,
                    name: athlete.athlete.displayName,
                    points: athlete.stats[13],
                    rebounds: athlete.stats[6],
                    defensiveRebounds: athlete.stats[5],
                    offensiveRebounds: athlete.stats[4],
                    assists: athlete.stats[7],
                    blocks: athlete.stats[9],
                    steals: athlete.stats[8],
                    minutes: athlete.stats[0],
                    fouls: athlete.stats[11],
                    fieldGoals: fieldGoals,
                    fieldGoalsAttempted: fieldGoalsAttempted,
                    fieldGoalsMade: fieldGoalsMade,
                    freeThrows: freeThrows,
                    freeThrowsAttempted: freeThrowsAttempeted,
                    freeThrowsMade: freeThrowsMade,
                    turnovers: athlete.stats[10],
                    threePoints: threePoints,
                    threePointFieldGoalsAttempted: threePointsAttempted,
                    threePointFieldGoalsMade: threePointsMade
                }                
                formattedPlayers.push(formattedPlayer);
            }
        }

        return formattedPlayers;
    } catch (err) {
        console.error("Error fetching player stats: ", err.message);
    }
}

const getTeamIdMap = async () => {
    const teamIdMap = {};
    const teams = await Team.find({ sport: 'basketball' });
    teams.forEach(team => {
        if (team.espnId) {
            teamIdMap[team.espnId] = team._id;
        }
    });
    //console.log(teamIdMap);
    return teamIdMap;
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
        const formattedGames = await fetchGames(startDate, endDate);                
        console.log('All games fetched');

        await Game.deleteMany({ sport: 'basketball', season: SEASON_YEAR });
        console.log("deleted old games");

        console.log('Inserting Games into Database');
        await Game.insertMany(formattedGames)
            .then(() => console.log('Games Inserted sucessfully'))
            .catch(err => {
                console.error('Insert error: ', err.message);
            });
        
        console.log(`Seeded ${formattedGames.length} games for ${SEASON_YEAR}.`);

        const games = await Game.find({sport: 'basketball', season: SEASON_YEAR}).limit(5);
        console.log('Sample games: ', games); 
        console.log(games[0].players[0]);

        mongoose.disconnect();
    } catch (err) {
        console.error('error seeding games:', err.message);
        process.exit(1);
    }
};

seed();
