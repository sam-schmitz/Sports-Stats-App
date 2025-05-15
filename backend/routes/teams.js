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

module.exports = router
