// seedPlayerSeasonStats.js
// By: Sam Schmitz
// Adds season data to the current players in the database. 

const mongoose = require('mongoose');
const Player = require('../models/Player');
const Game = require('../models/Game');
require('dotenv').config();

const seasons = ['2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];

const SEASON_TYPE = 'Post Season';  // Overall, Regualr Season, or Post Season


const seed = async () => {
    console.log(`Calculating season stats`);
    console.log(`Using season type: ${SEASON_TYPE}`);
    await mongoose.connect(process.env.MONGO_URI);

    // get a list of all players in the database
    const players = await Player.find({ sport: 'basketball' });

    // for each one go through each season
    for (const player of players) {

        // for each season find every game played by the player
        for (const season of seasons) {
            const games = await Game.find({
                sport: 'basketball',
                season: season,
                'players': {
                    $elemMatch: {
                        player_id: player._id
                    }
                }
            });

            // Create a black SeasonStatsSchema to keep track of season totals
            let SeasonStats = {
                season: season.split('-')[0],
                season_type: SEASON_TYPE,
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
                minutes: 0,
                doubleDouble: 0,
                tripleDouble: 0
            };

            // use each game to calculate total season stats
            for (const game of games) {
                if (game.game_type == SEASON_TYPE || SEASON_TYPE == 'Overall') {
                    //console.log(game);
                    const stat = game.players.find(ps => ps.player_id === player._id);

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
                    SeasonStats.offensiveRebounds += stat.offensiveRebounds;
                    SeasonStats.defensiveRebounds += stat.defensiveRebounds;
                    SeasonStats.steals += stat.steals;
                    SeasonStats.blocks += stat.blocks;
                    SeasonStats.turnovers += stat.turnovers;
                    SeasonStats.fouls += stat.fouls;
                    SeasonStats.minutes += stat.minutes
                    // Add triple double and double double
                }                
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
                if (SeasonStats.fieldGoalsMade > 0) {
                    SeasonStats.fieldGoalPct = SeasonStats.fieldGoalsMade / SeasonStats.fieldGoalsAttempted;
                } else {
                    SeasonStats.fieldGoalPct = 0;
                }
                

                SeasonStats.avgThreePointsMade = SeasonStats.threePointsMade / SeasonStats.games;
                SeasonStats.avgThreePointsAttempted = SeasonStats.threePointsAttempted / SeasonStats.games;
                if (SeasonStats.threePointsMade > 0) {
                    SeasonStats.threePointsPct = SeasonStats.threePointsMade / SeasonStats.threePointsAttempted;
                } else {
                    SeasonStats.threePointsPct = 0;
                }
                

                SeasonStats.avgFreeThrowsMade = SeasonStats.freeThrowsMade / SeasonStats.games;
                SeasonStats.avgFreeThrowsAttempted = SeasonStats.freeThrowsAttempted / SeasonStats.games;
                if (SeasonStats.freeThrowsMade > 0) {
                    SeasonStats.freeThrowPct = SeasonStats.freeThrowsMade / SeasonStats.freeThrowsAttempted;
                } else {
                    SeasonStats.freeThrowPct = 0;
                }
                

                SeasonStats.avgPoints = SeasonStats.points / SeasonStats.games;
                // Assist turnover ratio
                // Steal Foul Ratio
                // block foul Ratio
                // field goal pct
                // three point pct
                // free throw pct
                // true shooting pct
                // shooting efficiency 
                // scoring efficiency
            } else {
                SeasonStats.avgDefensiveRebounds = 0;
                SeasonStats.avgOffensiveRebounds = 0;
                SeasonStats.avgRebounds = 0;
                SeasonStats.avgBlocks = 0;
                SeasonStats.avgSteals = 0;
                SeasonStats.avgAssists = 0;
                SeasonStats.avgTurnovers = 0;
                SeasonStats.avgFouls = 0;
                SeasonStats.avgMinutes = 0;

                SeasonStats.avgFieldGoalsMade = 0;
                SeasonStats.avgFieldGoalsAttempted = 0;
                SeasonStats.fieldGoalPct = 0;

                SeasonStats.avgThreePointsMade = 0;
                SeasonStats.avgThreePointsAttempted = 0;
                SeasonStats.threePointsPct = 0;

                SeasonStats.avgFreeThrowsMade = 0;
                SeasonStats.avgFreeThrowsAttempted = 0;
                SeasonStats.freeThrowPct = 0;

                SeasonStats.avgPoints = 0;
            }        

            // add the created schemas to player's model
            player.seasonStats.push(SeasonStats);
        }

        //console.log(player.seasonStats);        
        await player.save();
    }
    

    mongoose.disconnect();
}

seed();
