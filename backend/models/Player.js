// Player.js
// By: Sam Schmitz
// A model for the MongoDB that stores information about a player

const mongoose = require('mongoose');

//subschema for season stats
const SeasonStatSchema = new mongoose.Schema({
    season: {
        type: String
    },
    blocks: Number,
    defensiveRebounds: Number,
    steals: Number,
    turnoverPoints: Number,
    defReboundRate: Number,
    avgDefensiveRebounds: Number,
    avgBlocks: Number,
    avgSteals: Number,
    avg48DefensiveRebounds: Number,
    avg48Blocks: Number,
    avg48Steals: Number,
    disqualifications: Number,
    flagrantFouls: Number,
    fouls: Number,
    PER: Number,
    reboundRate: Number,
    ejections: Number,
    technicalFouls: Number,
    rebounds: Number,
    VORP: Number,
    minutes: Number,
    avgMinutes: Number,
    NBARating: Number,
    avgFouls: Number,
    assistTurnoverRatio: Number,
    stealFoulRatio: Number,
    blockFoulRatio: Number,
    avg48Rebounds: Number,
    avg48Fouls: Number,
    r40: Number,
    gamesPlayed: Number,
    gamesStarted: Number,
    doubleDouble: Number,
    tripleDouble: Number,
    assists: Number,
    effectiveFGPct: Number,
    fieldGoals: Number,
    fieldGoalsAttempted: Number,
    fieldGoalsMade: Number,
    fieldGoalPct: Number,
    freeThrows: Number,
    freeThrowPct: Number,
    freeThrowsAttempted: Number,
    freeThrowsMade: Number,
    offensiveRebounds: Number,
    points: Number,
    turnovers: Number,
    threePointPct: Number,
    threePointFieldGoalsAttempted: Number,
    threePointFieldGoalsMade: Number,
    trueShootingPct: Number,
    totalTurnovers: Number,
    avgFieldGoalsMade: Number,
    avgFieldGoalsAttempted: Number,
    avgThreePointFieldGoalsMade: Number,
    avgThreePointFieldGoalsAttempted: Number,
    avgFreeThrowsMade: Number,
    avgFreeThrowsAttempted: Number,
    avgPoints: Number,
    avgOffensiveRebounds: Number,
    avgAssists: Number,
    avgTurnovers: Number,
    offensiveReboundPct: Number,
    estimatedPossessions: Number,
    avgEstimatedPossessions: Number,
    pointsPerEstimatedPossessions: Number,
    threePointFieldGoalPct: Number,
    twoPointFieldGoalsMade: Number,
    twoPointFieldGoalsAttempted: Number,
    avgTwoPointFieldGoalsMade: Number,
    avgTwoPointFieldGoalsAttempted: Number,
    twoPointFieldGoalPct: Number,
    shootingEfficiency: Number,
    scoringEfficiency: Number,
    avg48FieldGoalsMade: Number,
    avg48FieldGoalsAttempted: Number,
    avg48ThreePointFieldGoalsMade: Number,
    avg48ThreePointFieldGoalsAttempted: Number,
    avg48FreeThrowsMade: Number,
    avg48FreeThrowsAttempted: Number,
    avg48Points: Number,
    avg48OffensiveRebounds: Number,
    avg48Assists: Number,
    avg48Turnovers: Number,
    p40: Number,
    a40: Number    
}, { _id: false });

const PlayerSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true  // ex: "lebron_james" (use underscores)
    },
    sport: {
        type: String,
        required: true,
        enum: ['basketball', 'soccer', 'football', 'baseball', 'hockey']
    },
    name: {
        type: String,
        required: true  // Full name: "Lebron James"
    },
    team_id: {
        type: String,
        ref: 'Team',
        required: true
    },
    team_name: {
        type: String,
        required: true
    },
    position: {
        type: String    // ex: "SF"
    },
    jersey_number: {
        type: Number
    },
    height: {
        type: String    // ex: "6'9\""
    },
    weight: {
        type: String    // ex: "250 lbs"
    },
    dob: {
        type: Date
    },
    nationality: {
        type: String
    },
    photoUrl: {
        type: String
    },
    age: {
        type: String
    },
    salary: {
        type: String
    },
    seasonStats: [SeasonStatSchema]
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
