// routes/games.js
// By: Sam Schmitz

const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET /games - get all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        console.error('Error fetching games', err);
        res.status(500).json({ error: `Server error` });
    }
})

module.export = router
