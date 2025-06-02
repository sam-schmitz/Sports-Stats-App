// seedTeams.js
// By: Sam Schmitz
// seeds the database with the teams

const mongoose = require('mongoose');
const axios = require('axios');
const Team = require('../models/Team');
require('dotenv').config();

const fetchNBATeams = async () => {
    /*
    // Old code
    const url = 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA';
    const response = await axios.get(url);
    return response.data.teams || [];
    */
    try {
        const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
        const res = await axios.get(url);
        const teams = res.data.sports[0].leagues[0].teams.map(t => t.team);
        console.log(teams);

        const formattedTeams = teams.map(team => ({
            _id: team.id,
            sport: 'basketball',
            name: team.displayName,
            abbreviation: team.abbreviation,
            city: team.location,
            conference: team.conference?.name || null,
            division: team.division?.name || null,
            stadium: team.venue?.fullName || null,
            location: team.location,
            logo: team.logos?.[0]?.href || null
        }));

        console.log(formattedTeams);
        return formattedTeams;
    } catch (err) {
        console.error('Error fetching NBA teams:', err.message);
    }
    
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
        /*
        // Old seeding
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const rawTeams = await fetchNBATeams();
        const formatted = formatTeams(rawTeams);

        await Team.deleteMany({ sport: 'basketball' });
        await Team.insertMany(formatted);

        console.log('NBA teams seeded successfully. ');
        mongoose.disconnect();
        */

        await mongoose.connect(process.env.MONGO_URI);
        const formatted = fetchNBATeams();

        //await Team.deleteMany({ sport: 'basketball' });
        //await Team.insertMany(formatted);
        //console.log('NBA teams seeded successfully. ');

        mongoose.disconnect();
    } catch (err) {
        console.error('Seeding failed: ', err.message);
        process.exit(1);
    }
};

seed();
