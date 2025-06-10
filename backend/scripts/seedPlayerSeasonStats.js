// seedPlayerSeasonStats.js
// By: Sam Schmitz
// Adds season data to the current players in the database. 

const mongoose = require('mongoose');
const Player = require('../models/Player');
const Game = require('../models/Game');
require('dotenv').config();

const seed = () => {
    await mongoose.connect(process.env.MONGO_URI);

    mongoose.disconnect();
}

seed();
