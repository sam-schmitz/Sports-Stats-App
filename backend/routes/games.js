// routes/games.js
// By: Sam Schmitz

const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET /games?search=<term>&page=<number>&limit=<number>
router.get("/", async (req, res) => {
    try {
        const { search, page = 1, limit = 100 } = req.query;
        const filter = {};        

        if (search) {
            const year = parseInt(search);
            if (!isNaN(year) && search.length === 4) {
                start = new Date(`${year}-01-01`);
                end = new Date(`${year + 1}-01-01`);
                filter.date = { $gte: start, $lt: end };
            } else if (!isNaN(year) && search.length === 6) {
                let y = parseInt(search.slice(0, 4));
                let m = parseInt(search.slice(4, 6));
                if (m === 12) {
                    start = new Date(`${y}-${m}-01`);
                    end = new Date(`${y}-01-01`);
                    filter.date = { $gte: start, $lt: end };
                } else {
                    start = new Date(`${y}-${m}-01`);
                    end = new Date(`${y}-${m + 1}-01`);
                    filter.date = { $gte: start, $lt: end };
                }
            } else if (!isNaN(year) && search.length === 8) {
                // parse the year, month, date from the search query
                let y = parseInt(search.slice(0, 4));
                let m = parseInt(search.slice(4, 6));
                let d = parseInt(search.slice(7, 9));

                //get the start and end dates for the search
                end = new Date(`${y}-${m}-${d}`);
                start = new Date(end);
                start.setDate(start.getDate() - 1); //the day before end
                
                filter.date = { $gte: start, $lt: end }
            } else {
                // search by home or away team
                filter.$or = [
                    { home_team_name: { $regex: search, $options: "i" } },
                    { away_team_name: { $regex: search, $options: "i" } }                    
                ];
            }
            
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const games = await Game.find(filter).skip(skip).limit(parseInt(limit));        

        res.json(games);
    } catch (err) {
        console.error('Error fetching games: ', err);
        res.status(500).json({ error: `Server Error` });
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

router.get('/player/:player', async (req, res) => {
    try {
        const player_id = req.params.player;
        const games = await Game.find({
            'players.player_id': player_id,
            sport: 'basketball'
        });

        res.json(games);
    } catch (err) {
        console.error('Error fetching games: ', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router
