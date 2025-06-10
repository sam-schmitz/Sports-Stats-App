// seedPlayerSeasonStats.js
// By: Sam Schmitz
// Adds season data to the current players in the database. 

const mongoose = require('mongoose');
const Player = require('../models/Player');
const Game = require('../models/Game');
require('dotenv').config();

const seasons = ['2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];


const seed = () => {
    await mongoose.connect(process.env.MONGO_URI);

    // get a list of all players in the database
    const players = await Player.find({ sport: basketball });

    // for each one go through each season
    for (const player of players) {

        // for each season find every game played by the player
        for (const season of seasons) {
            const games = await Game.find({
                sport: basketball,
                season: season,
                'players': {
                    $elemMatch: {
                        player_id: player._id
                    }
                }
            });

            // Create a black SeasonStatsSchema to keep track of season totals
            let SeasonStats = {
                season: season,
                games: 0,
                points: 0,
                assists: 0,
                fieldGoalsMade: 0,
                fieldGoalsAttempted: 0,
                threePointsMade: 0,
                threePointsAttempted: 0,
                freeThrowsMade: 0,
                freeThrowsAttempted: 0,
                rebounds: 0,
                offensiveRebounds: 0,
                defensiveRebounds: 0,
                steals: 0,
                blocks: 0,
                turnovers: 0,
                fouls: 0,
                doubleDouble: 0,
                tripleDouble: 0
            };

            // use each game to calculate total season stats
            for (const game of games) {
                const stat = game.player_stats.find(ps => ps.player_id === player._id);

                SeasonStats.games += 1;
                SeasonStats.points += stat.points;
                SeasonStats.assists += stat.assists;
                SeasonStats.fieldGoalsMade += stat.fieldGoalsMade;
                SeasonStats.fieldGoalsAttempted += stat.fieldGoalsAttempted;
                SeasonStats.threePointsMade += stat.fieldGoalsMade;
                SeasonStats.threePointsAttempted += stat.fieldGoalsAttempted;
                SeasonStats.freeThrowsMade += stat.freeThrowsMade;
                SeasonStats.freeThrowsAttempted += stat.freeThrowsAttempted;
                SeasonStats.rebounds += stat.rebounds;
                SeasonStats.offensiveRebounds += stat.offensiveRebound;
                SeasonStats.defensiveRebounds += stat.defensiveRebounds;
                SeasonStats.steals += stat.steals;
                SeasonStats.blocks += stat.blocks;
                SeasonStats.turnovers += stat.turnovers;
                seasonStats.fouls += stat.fouls;
                // Add triple double and double double
            }

            // calculate stats that need to be calculated
            if (SeasonStats.games !== 0) {
                SeasonStats.avgDefensiveRebounds = SeasonStats.defensiveRebounds / SeasonStats.games;
                SeasonStats.avgOffensiveRebounds = SeasonStats.offensiveRebounds / SeasonStats.games;
                SeasonStats.avgRebounds = SeasonStats.rebounds / SeasonStats.games;
                SeasonStats.avgBlocks = SeasonStats.blocks / SeasonStats.games;
                SeasonStats.avgSteals = SeasonStats.steals / SeasonStats.games;
                SeasonStats.avgAssists = SeasonStats.assists / SeasonStats.games;
                SeasonStats.avgTurnovers = SeasonStats.turnovers / SeasonStats.games;
                SeasonStats.avgFouls = SeasonStats.fouls / SeasonStats.games;
                SeasonStats.avgMinutes = SeasonStats.minutes / SeasonStats.games;
                SeasonStats.avgFieldGoalsMade = SeasonStats.fieldGoalsMade / SeasonStats.games;
                SeasonStats.avgFieldGoalsAttempted = SeasonStats.fieldGoalsAttempted / SeasonStats.games;
                SeasonStats.avgThreePointsMade = SeasonStats.threePointsMade / SeasonStats.games;
                SeasonStats.avgThreePointsAttempted = SeasonStats.threePointsAttempted / SeasonStats.games;
                SeasonStats.avgFreeThrowsMade = SeasonStats.freeThrowsMade / SeasonStats.games;
                SeasonStats.avgFreeThrowsAttempted = SeasonStats.freeThrowsAttempted / SeasonStats.games;
                // Assist turnover ratio
                // Steal Foul Ratio
                // block foul Ratio
                // field goal pct
                // three point pct
                // free throw pct
                // true shooting pct
                // shooting efficiency 
                // scoring efficiency
            }            

            // add the created schemas to player's model
            player.seasonStats.push(SeasonStats);
        }

        await player.save();
    }
    

    mongoose.disconnect();
}

seed();
