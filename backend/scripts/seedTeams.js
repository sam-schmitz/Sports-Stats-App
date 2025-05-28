// seedTeams.js
// By: Sam Schmitz
// seeds the database with the teams

const mongoose = require('mongoose');
const axios = require('axios');
const Team = require('../models/Team');
require('dotenv').config();

const fetchNBATeams = async () => {
    const url = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA';
    const response = await axios.get(url);
    return response.data.teams || [];
};

const formatTeams = (teams) => {
    return teams.map(team => ({
        _id: team.idTeam,
        sport: 'basketball',
        name: team.strTeam,
        abbreviation: team.strTeamShort || team.strTeam.slice(0, 3).toUpperCase(),
        city: team.strStadiumLocation,
        conference: team.strLeague.includes('Eastern') ? 'Eastern' : 'Western',
        divison: 'Unknown', //TheSportsDB doesn't provide divison info
        logoUrl: team.strLogo,
        stadium: team.strStadium,
        location: team.strLocation
    }));
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const rawTeams = await fetchNBATeams();
        const formatted = formatTeams(rawTeams);

        await Team.deleteMany({ sport: 'basketball' });
        await Team.insertMany(formatted);

        console.log('NBA teams seeded successfully. ');
        mongoose.disconnect();
    } catch (err) {
        console.error('Seeding failed: ', err.message);
        process.exit(1);
    }
};

seed();
