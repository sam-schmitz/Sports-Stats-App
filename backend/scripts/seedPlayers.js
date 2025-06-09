// seedPlayers.js
// By: Sam Schmitz
// seeds the database with the players

const mongoose = require('mongoose');
const axios = require('axios');
const Player = require('../models/Player');
const Team = require('../models/Team');
require('dotenv').config();

const fetchPlayerSeasonStats = async (id, season) => {
    // id  = number
    // season = YYYY

    try {
        const url = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${id}/statistics?season=${season}&seasonType=2`;
        const { data } = await axios.get(url);

        // Parse data into maps that pair stat name with it's value

        const defensive = data.splits.categories.find(c => c.name === "defensive").stats;
        const defensiveMap = Object.fromEntries(
            defensive.map(stat => [stat.name, stat.displayValue])
        );

        const general = data.splits.categories.find(c => c.name === "general").stats;
        const generalMap = Object.fromEntries(
            general.map(stat => [stat.name, stat.displayValue])
        );

        const offensive = data.splits.categories.find(c => c.name === "offensive").stats;
        const offensiveMap = Object.fromEntries(
            offensive.map(stat => [stat.name, stat.displayValue])
        );

        // format the stats into the propper schema structure
        formattedStats = {
            
        };

        return formattedStats;
    } catch (err) {
        console.error(`Error fetching player id: ${id}'s stats for season: ${season}: err.message`);
    }
};

const fetchPlayersForTeam = async (teamId, teamName, espnId) => { 
    try {
        const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${espnId}/roster`;        
        const { data } = await axios.get(url);
        const players = data.athletes;

        const formattedPlayers = [];

        for (const p of players) {    

            const season = '2024'

            // fetch career stats
            const careerStats = await fetchPlayerCareerStats(p._id);

            // fetch season stats
            const seasonStats = await fetchPlayerSeasonStats(p._id, season);

            // format data to mongo Player model
            formattedPlayers.push({
                _id: p.id,
                name: p.displayName,
                team_id: teamId,
                team_name: teamName,
                sport: 'basketball',
                nationality: p.birthPlace?.country || null,
                position: p.position.name,
                dob: p.dateOfBirth,
                height: p.height,   // inches (ex: 80)
                weight: p.weight,
                photoUrl: p.headshot?.href || null,
                jersey_number: p.jersey,
                salary: p.contracts[0]
                    ? p.contracts[0].salary
                    : null,
                age: p.age,
                careerStats: careerStats,
                seasonStats: seasonStats
            });
        }

        //console.log(formattedPlayers);
        return formattedPlayers;
    } catch (err) {
        console.error('Error fetching player data', err.message);
    }
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const teams = await Team.find({ sport: 'basketball' }, '_id name espnId').lean();         

        await Player.deleteMany({ sport: 'basketball' });

        for (const team of teams) {            
            const players = await fetchPlayersForTeam(team._id, team.name, team.espnId);

            if (!Array.isArray(players)) {
                console.warn(`No players found for team ${teamId}`);
                continue;
            }
            
            await Player.insertMany(players);

            console.log(`players seeded for team: ${team.name}`);
        }

        console.log('All NBA players seeded successfully. ');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding players:', err.message);
        process.exit(1);
    }
};

seed();
