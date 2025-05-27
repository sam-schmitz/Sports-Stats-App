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
        console.error('Error fetching players', err);
        res.status(500).json({ error: `Server error` });
    }
});

router.get('/name/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const player = await Player.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (err) {
        console.error('Error fetching player', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const player = await Player.findOne({ _id: { $regex: new RegExp(`^${id}$`, 'i') } });

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (err) {
        console.error('Error fetching player', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/team/:team', async (req, res) => {
    try {
        const team = req.params.team;
        const players = await Player.find({ team_id: { $regex: new RegExp(`^${team}$`, 'i') } });

        if (!players) {
            return res.status(404).json({ error: 'Players not found' });
        }

        res.json(players);
    } catch (err) {
        console.error('Error fetching player', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/position/:position', async (req, res) => {
    try {
        const position = req.params.position;
        const players = await Player.find({ position: { $regex: new RegExp(`^${position}$`, 'i') } });

        if (!players) {
            return res.status(404).json({ error: 'Players not found' });
        }

        res.json(players);
    } catch (err) {
        console.error('Error fetching player', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/nationality/:nationality', async (req, res) => {
    try {
        const nationality = req.params.nationality;
        const players = await Player.find({ nationality: { $regex: new RegExp(`^${nationality}$`, 'i') } });

        if (!players) {
            return res.status(404).json({ error: 'Players not found' });
        }

        res.json(players);
    } catch (err) {
        console.error('Error fetching player', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router
