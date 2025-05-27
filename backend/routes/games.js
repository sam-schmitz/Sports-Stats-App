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

router.get('/id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const game = await Game.findOne({ _id: { $regex: new RegExp(`^${id}$`, 'i') } });

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(game);
    } catch (err) {
        console.error('Error fetching game', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router
