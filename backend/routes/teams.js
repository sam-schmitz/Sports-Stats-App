// routes/teams.js
// By: Sam Schmitz


const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// GET /teams - get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        console.error('Error fetching teams: ', err);
        res.status(500).json({ error: `Server error` });
    }
});

router.get('/name/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const team = await Team.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (err) {
        console.error('Error fetching team by name:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router
