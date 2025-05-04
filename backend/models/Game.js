// Game.js
// By: Sam Schmitz
// A model for the MongoDB that stores information about a game

const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    sport = {
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
    home_team: {
        type: String,
        ref: 'Team',
        required: true
    },
    away_team: {
        type: String,
        ref: 'Team',
        required: true
    },
    home_score: Number,
    away_score: Number,
    location: String,   // stadium/arena
    players: [PlayerStatSchema] // Embedded stats per player
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
