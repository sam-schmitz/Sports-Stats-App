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

router.get('/date/:date', async (req, res) => {
    try {
        const dateParam = req.params.date;

        const start = new Date(dateParam);
        const end = new Date(dateParam);
        end.setUTCHours(23, 59, 59, 999);   //end of the date in UTC

        const games = await Game.find({
            date: {
                $gte: start,
                $lte: end
            }
        });

        if (!games || games.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(games);
    } catch (err) {
        console.error('Error fetching game', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/season/:season', async (req, res) => {
    try {
        const season = req.params.season;
        const games = await Game.find({ season: { $regex: new RegExp(`^${season}$`, 'i') } });

        if(!games || games.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(games);
    } catch (err) {
        console.error('Error fetching game', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/team/:team', async (req, res) => {
    try {
        const team_id = req.params.team;
        const games = await Game.find({
            $or: [
                { home_team_id: { $regex: new RegExp(`^${team_id}$`, 'i') } },
                { away_team_id: { $regex: new RegExp(`^${team_id}$`, 'i') } }
            ]
        }).sort({ date: 1 });   //sort oldest to newest

        if (!games || games.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(games);
    } catch (err) {
        console.error('Error fetching game', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/sport/:sport', async (req, res) => {
    try {
        const sport = req.params.sport;
        const games = await Game.find({ sport: { $regex: new RegExp(`^${sport}$`, 'i') } });

        if (!games || games.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(games);
    } catch (err) {
        console.error('Error fetching game', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/gameType/:gameType', async (req, res) => {
    try {
        const gameType = req.params.gameType;
        const games = await Game.find({ game_type: { $regex: new RegExp(`^${gameType}$`, 'i') } });

        if (!games || games.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json(games);
    } catch (err) {
        console.error('Error fetching game', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router
