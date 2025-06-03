// clean.js
// By: Sam Schmitz
// Used to clean db of bad data

const mongoose = require('mongoose');
const Player = require('../models/Player');
require('dotenv').config();

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Player.deleteMany({ team_name: 'Arsenal' });
        console.log('Arsenal players removed');

        mongoose.disconnect();
    } catch (err) {
        console.error('Error cleaning database', err.message);
        process.exit(1);
    }
}

clean();
