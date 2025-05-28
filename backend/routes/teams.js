// routes/teams.js
// By: Sam Schmitz


const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');

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

// GET /teams/name/:name - get a team with a specific name
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

// GET /teams/sport/:sport - get all teams with a specific sport
router.get('/sport/:sport', async (req, res) => {
    try {
        const sport = req.params.sport;
        const teams = await Team.find({ sport: { $regex: new RegExp(`^${sport}$`, 'i') } });

        if (!teams) {
            return res.status(404).json({ error: 'Teams not found' });
        }

        res.json(teams);
    } catch (err) {
        console.error('Error fetching team by sport', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /teams/id/:id - get a team by id
router.get('/id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const team = await Team.findOne({ _id: { $regex: new RegExp(`^${id}$`, 'i') } });

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (err) {
        console.error('Error fetching team data', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /teams/id/:id/players - get a teams players via the team id
router.get('/id/:id/players', async (req, res) => {
    try {
        const id = req.params.id;
        const players = await getPlayers(id);

        if (!players || players.length === 0) {
            return res.status(404).json({ error: 'No players found for this team' });
        }

        res.json(players);
    } catch (err) {
        console.error('Error fetching players by team ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

async function getPlayers(teamID) {
    try {
        const players = await Player.find({ team_id: { $regex: new RegExp(`^${teamID}$`, 'i') } });

    return players;
    } catch (err) {
        console.error('Error fetching players for team', err);
        return null;
    }
}

module.exports = router
