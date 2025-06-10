// seedPlayers.js
// By: Sam Schmitz
// seeds the database with the players

const mongoose = require('mongoose');
const axios = require('axios');
const Player = require('../models/Player');
const Team = require('../models/Team');
require('dotenv').config();

const fetchPlayerCareerStats = async (id) => {
    try {
        const url = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/athletes/${id}/statistics`;
        const { data } = await axios.get(url);

        // Parse data into maps that pair stat name with it's value
        const defensive = data.splits.categories.find(c => c.name === "defensive").stats;
        const defensiveMap = Object.fromEntries(
            defensive.map(stat => [stat.name, stat.displayValue])
        );

        const general = data.splits.categories.find(c => c.name === "general").stats;
        const generalMap = Object.fromEntries(
            general.map(stat => [stat.name, stat.value])
        );

        const offensive = data.splits.categories.find(c => c.name === "offensive").stats;
        const offensiveMap = Object.fromEntries(
            offensive.map(stat => [stat.name, stat.value])
        );

        const formattedStats = formattSeasonStats('career', defensiveMap, generalMap, offensiveMap);

        return formattedStats;

    } catch (err) {
        console.error(`Error fetching player id: ${id}'s stats for career:`, err.message);
    }
}

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
            general.map(stat => [stat.name, stat.value])
        );

        const offensive = data.splits.categories.find(c => c.name === "offensive").stats;
        const offensiveMap = Object.fromEntries(
            offensive.map(stat => [stat.name, stat.value])
        );

        // format the stats into the propper schema structure
        const formattedStats = formattSeasonStats(season, defensiveMap, generalMap, offensiveMap);

        return formattedStats;
    } catch (err) {
        console.error(`Error fetching player id: ${id}'s stats for season: ${season}:`, err.message);
    }
};

const formattSeasonStats = (season, defensiveMap, generalMap, offensiveMap) => {
    const formattedStats = {
        season: season,
        blocks: defensiveMap.blocks,
        defensiveRebounds: defensiveMap.defensiveRebounds,
        steals: defensiveMap.steals,
        turnoverPoints: defensiveMap.turnoverPoints,
        defReboundRate: defensiveMap.defReboundRate,
        avgDefensiveRebounds: defensiveMap.avgDefensiveRebounds,
        avgBlocks: defensiveMap.avgBlocks,
        avgSteals: defensiveMap.avgSteals,
        avg48DefensiveRebounds: defensiveMap.avg48DefensiveRebounds,
        avg48Blocks: defensiveMap.avg48Blocks,
        avg48Steals: defensiveMap.avg48Steals,
        disqualifications: generalMap.disqualifications,
        flagrantFouls: generalMap.flagrantFouls,
        fouls: generalMap.fouls,
        PER: generalMap.PER,
        reboundRate: generalMap.reboundRate,
        ejections: generalMap.ejections,
        technicalFouls: generalMap.technicalFouls,
        rebounds: generalMap.rebounds,
        VORP: generalMap.VORP,
        minutes: generalMap.minutes,
        avgMinutes: generalMap.avgMinutes,
        NBARating: generalMap.NBARating,
        avgFouls: generalMap.avgFouls,
        assistTurnoverRatio: generalMap.assistTurnoverRatio,
        stealFoulRatio: generalMap.stealFoulRatio,
        blockFoulRatio: generalMap.blockFoulRatio,
        avg48Rebounds: generalMap.avg48Rebounds,
        avg48Fouls: generalMap.avg48Fouls,
        r40: generalMap.r40,
        gamesPlayed: generalMap.gamesPlayed,
        gamesStarted: generalMap.gamesStarted,
        doubleDouble: generalMap.doubleDouble,
        tripleDouble: generalMap.tripleDouble,
        assists: offensiveMap.assists,
        effectiveFGPct: offensiveMap.effectiveFGPct,
        fieldGoals: offensiveMap.fieldGoals,
        fieldGoalsAttempted: offensiveMap.fieldGoalsAttempted,
        fieldGoalsMade: offensiveMap.fieldGoalsMade,
        fieldGoalPct: offensiveMap.fieldGoalPct,
        freeThrows: offensiveMap.freeThrows,
        freeThrowPct: offensiveMap.freeThrowPct,
        freeThrowsAttempted: offensiveMap.freeThrowsAttempted,
        freeThrowsMade: offensiveMap.freeThrowsMade,
        offensiveRebounds: offensiveMap.offensiveRebounds,
        points: offensiveMap.points,
        turnovers: offensiveMap.turnovers,
        threePointPct: offensiveMap.threePointPct,
        threePointFieldGoalsAttempted: offensiveMap.threePointFieldGoalsAttempted,
        threePointFieldGoalsMade: offensiveMap.threePointFieldGoalsMade,
        trueShootingPct: offensiveMap.trueShootingPct,
        totalTurnovers: offensiveMap.totalTurnovers,
        avgFieldGoalsMade: offensiveMap.avgFieldGoalsMade,
        avgFieldGoalsAttempted: offensiveMap.avgFieldGoalsAttempted,
        avgThreePointFieldGoalsMade: offensiveMap.avgThreePointFieldGoalsMade,
        avgThreePointFieldGoalsAttempted: offensiveMap.avgThreePointFieldGoalsAttempted,
        avgFreeThrowsMade: offensiveMap.avgFreeThrowsMade,
        avgFreeThrowsAttempted: offensiveMap.avgFreeThrowsAttempted,
        avgPoints: offensiveMap.avgPoints,
        avgOffensiveRebounds: offensiveMap.avgOffensiveRebounds,
        avgAssists: offensiveMap.avgAssists,
        avgTurnovers: offensiveMap.avgTurnovers,
        offensiveReboundPct: offensiveMap.offensiveReboundPct,
        estimatedPossessions: offensiveMap.estimatedPossessions,
        avgEstimatedPossessions: offensiveMap.avgEstimatedPossessions,
        pointsPerEstimatedPossessions: offensiveMap.pointsPerEstimatedPossessions,
        threePointFieldGoalPct: offensiveMap.threePointFieldGoalPct,
        twoPointFieldGoalsMade: offensiveMap.twoPointFieldGoalsMade,
        twoPointFieldGoalsAttempted: offensiveMap.twoPointFieldGoalsAttempted,
        avgTwoPointFieldGoalsMade: offensiveMap.avgTwoPointFieldGoalsMade,
        avgTwoPointFieldGoalsAttempted: offensiveMap.avgTwoPointFieldGoalsAttempted,
        twoPointFieldGoalPct: offensiveMap.twoPointFieldGoalPct,
        shootingEfficiency: offensiveMap.shootingEfficiency,
        scoringEfficiency: offensiveMap.scoringEfficiency,
        avg48FieldGoalsMade: offensiveMap.avg48FieldGoalsMade,
        avg48FieldGoalsAttempted: offensiveMap.avg48FieldGoalsAttempted,
        avg48ThreePointFieldGoalsMade: offensiveMap.avg48ThreePointFieldGoalsMade,
        avg48ThreePointFieldGoalsAttempted: offensiveMap.avg48ThreePointFieldGoalsAttempted,
        avg48FreeThrowsMade: offensiveMap.avg48FreeThrowsMade,
        avg48FreeThrowsAttempted: offensiveMap.avg48FreeThrowsAttempted,
        avg48Points: offensiveMap.avg48Points,
        avg48OffensiveRebounds: offensiveMap.avg48OffensiveRebounds,
        avg48Assists: offensiveMap.avg48Assists,
        avg48Turnovers: offensiveMap.avg48Turnovers,
        p40: offensiveMap.p40,
        a40: offensiveMap.a40
    };

    return formattedStats;
}

const fetchPlayersForTeam = async (teamId, teamName, espnId) => { 
    try {
        const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${espnId}/roster`;        
        const { data } = await axios.get(url);
        const players = data.athletes;

        const formattedPlayers = [];

        for (const p of players) {   

            // fetch a player's season and career stats

            playerSeasonStats = [];

            // Add career stats            
            playerSeasonStats.push(await fetchPlayerCareerStats(p.id));

            // Add season stats from 2019 season to 2024 season
            for (let year = 2019; year <= 2024; year++) {                
                playerSeasonStats.push(await fetchPlayerSeasonStats(p.id, year.toString()));
            }           

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
                //careerStats: careerStats,
                seasonStats: playerSeasonStats

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

        // Display 5 sample players
        const players = await Player.find().limit(5);
        console.log('Sample games: ', players);  
        //console.log(players[1].seasonStats[0]);
        //console.log(players[1].seasonStats[1]);

        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding players:', err.message);
        process.exit(1);
    }
};

seed();
