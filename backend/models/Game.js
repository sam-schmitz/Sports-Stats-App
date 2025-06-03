// Game.js
// By: Sam Schmitz
// A model for the MongoDB that stores information about a game

const mongoose = require('mongoose');

// Subschema for player performance in a game
const PlayerStatSchema = new mongoose.Schema({
    player_id: {
        type: String,
        ref: 'Player',
        required: true
    },
    team_id: {
        type: String,
        ref: 'Team',
        required: true
    },
    name: String,
    position: String,
    minutes: Number,
    points: Number,
    goals: Number,
    assists: Number,
    rebounds: Number,
    steals: Number,
    rebounds: Number,
    blocks: Number,
    turnovers: Number,
    yellow_cards: Number,
    red_cards: Number,
    saves: Number,
    passing_yards: Number,
    rushing_yards: Number,
    receiving_yards: Number
}, { _id: false });  

const GameSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: true,
        enum: ['basketball', 'soccer', 'football', 'baseball', 'hockey']
    },
    date: {
        type: Date,
        required: true
    },
    season: {
        type: String,
        required: true  // ex: "2024-2025"
    },
    home_team_id: {
        type: String,
        ref: 'Team',
        required: true
    },
    away_team_id: {
        type: String,
        ref: 'Team',
        required: true
    },
    home_team_name: {
        type: String,
        required: true
    },
    away_team_name: {
        type: String,
        required: true
    },
    home_score: Number,
    away_score: Number,
    venue: String,   // stadium/arena
    status: String,
    game_type: String,
    overtime: String,
    conferenceCompetition: String,
    winner: String,
    players: [PlayerStatSchema] // Embedded stats per player
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
