// routes/players.js
// By: Sam Schmitz

const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET /players - get all players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        console.error('Error fetchin players', err);
        res.status(500).json({ error: `Server error` });
    }
});

module.exports = router
