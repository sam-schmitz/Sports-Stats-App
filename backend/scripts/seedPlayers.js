// seedPlayers.js
// By: Sam Schmitz
// seeds the database with the players

const mongoose = require('mongoose');
const axios = require('axios');
const Player = require('../models/Player');
require('dotenv').config();

const fetchPlayersForTeam = async (teamID) => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id${teamID}`;
    const res = await axios.get(url);
    return res.data.player || [];
};

const formatPlayer = (p, teamId) => ({
    _id: p.idPlayer,
    name: p.strPlayer,
    team_id: teamID,
    sport: 'basketball',    // will need to be updated when other sports are added. 
    nationality: p.strNationality,
    position: p.strPosition,
    dob: p.dateBorn ? new Date(p.dateBorn) : null,
    height: p.strHeight,
    weight: p.strWeight,
    photoUrl: p.strCutout || p.strThumb,
    description: p.strDescriptionEN
});

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const nbaTeams = await Team.find({ sport: 'basketball' }).select('_id');
        const teamIds = nbaTeam.map(team => team._id);

        await Player.deleteMany({ sport: 'basketball' });   //clear old player data

        for (const teamId of teamIds) {
            const players = await fetchPlayersForTeam(teamId);
            const formatted = players.map(p => formatPlayer(p, teamId));
            await Player.insertMany(formatted, { ordered: false });
            console.log(`Seeded players for team ${teamId}`);
        }
        console.log('All NBA players seeded successfully. ');
        mongoose.disconnect();
    } catch (err) {
        console.lerror('Error seeding players:', err.message);
        process.exit(1);
    }
};

seed();
