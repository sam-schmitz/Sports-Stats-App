// Team.js
// By: Sam Schmitz
// A model for the MongoDB that stores information about a team

const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true  // ex: "lakers", "browns"
    },
    sport: {
        type: String,
        required: true,
        enum: ['basketball', 'soccer', 'football', 'baseball', 'hockey']
    },
    name: {
        type: String,
        required: true  // full name: "Los Angeles Lakers"
    },
    abbreviation: {
        type: String,
        required: true // ex: "LAL"
    },
    conference: {
        type: String // Optional, ex: "Western"
    },
    division: {
        type: String    // Optional, ex: "Pacific"
    },
    location: {
        type: String    //Optional, ex: "Los Angeles, CA"
    },
    logoUrl: {
        type: String    //Optional: store team logos
    },
    stadium: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
