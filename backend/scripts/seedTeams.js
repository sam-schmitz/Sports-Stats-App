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
        const baseTeamUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
        const { data } = await axios.get(baseTeamUrl);
        const teamList = data.sports[0].leagues[0].teams.map(t => t.team);
        //console.log(teamList);

        const detailedTeams = [];

        for (const team of teamList) {
            const id = team.id;
            const detailUrl = `${baseTeamUrl}/${id}`;
            console.log(detailUrl);

            const teamRes = await axios.get(detailUrl);
            const teamData = teamRes.data.team

            detailedTeams.push({
                _id: teamData.id,
                sport: 'basketball',
                name: teamData.displayName,
                abbreviation: teamData.abbreviation,
                city: teamData.location,
                conference: teamData.conference?.name || null,
                division: teamData.division?.name || null,
                stadium: teamData.franchise.venue?.fullName || null,
                location: teamData.franchise.venue
                    ? `${teamData.franchise.venue.address.city}, ${teamData.franchise.venue.address.state}`
                    : null,
                logo: teamData.logos?.[0]?.href || null,
                espn_id: teamData.id
            });
        }        

        console.log(detailedTeams);
        return detailedTeams;
    } catch (err) {
        console.error('Error fetching NBA team details:', err.message);
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
