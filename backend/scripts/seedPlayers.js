// seedPlayers.js
// By: Sam Schmitz
// seeds the database with the players

const mongoose = require('mongoose');
const axios = require('axios');
const Player = require('../models/Player');
const Team = require('../models/Team');
require('dotenv').config();

const fetchPlayersForTeam = async (teamId) => {    
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${teamId}`;    
    const res = await axios.get(url);
    return res.data.player || [];
};

const formatPlayer = (p, teamId) => ({
    _id: p.idPlayer,
    name: p.strPlayer,
    team_id: teamId,
    team_name: strTeam,
    sport: strSport,    // will need to be updated when other sports are added. 
    nationality: p.strNationality,
    position: p.strPosition,
    dob: p.dateBorn ? new Date(p.dateBorn) : null,
    height: p.strHeight,
    weight: p.strWeight,
    photoUrl: p.strCutout || p.strThumb,
    description: p.strDescriptionEN,
    jersey_number: p.strNumber
});

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const nbaTeams = await Team.find({ sport: 'basketball' }).select('_id');
        const teamIds = nbaTeams.map(team => team._id);

        await Player.deleteMany({ sport: 'basketball' });   //clear old player data

        for (const teamId of teamIds) {
            const players = await fetchPlayersForTeam(teamId);

            if (!Array.isArray(players)) {
                console.warn(`No players found for team ${teamId}`);
                continue;
            }

            for (const p of players) {
                const formatted = formatPlayer(p, teamId);
                await Player.updateOne(
                    { _id: formatted._id },
                    { $set: formatted },
                    { upsert: true }
                );
            }
            
            console.log(`Seeded players for team ${teamId}`);
        }
        console.log('All NBA players seeded successfully. ');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding players:', err.message);
        process.exit(1);
    }
};

seed();
