// Player.js
// By: Sam Schmitz
// A model for the MongoDB that stores information about a player

const mongoose = require('mongoose');

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
    }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
