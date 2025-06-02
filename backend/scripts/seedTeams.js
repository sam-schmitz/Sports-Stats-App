// seedTeams.js
// By: Sam Schmitz
// seeds the database with the teams

const mongoose = require('mongoose');
const axios = require('axios');
const Team = require('../models/Team');
require('dotenv').config();

const fetchNBATeams = async () => {
    try {
        // Gather a list of nba teams and their ids
        const baseTeamUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
        const { data } = await axios.get(baseTeamUrl);
        const teamList = data.sports[0].leagues[0].teams.map(t => t.team);

        const detailedTeams = [];

        for (const team of teamList) {
            // Create a url to get all of the needed data (specific to team)
            const id = team.id;
            const detailUrl = `${baseTeamUrl}/${id}`;            

            const teamRes = await axios.get(detailUrl);
            const teamData = teamRes.data.team

            // import divisions and conferences
            const meta = teamConferenceDivisionMap[teamData.abbreviation] || {};

            //format info to the MongoDB Model
            detailedTeams.push({
                _id: teamData.id,
                sport: 'basketball',
                name: teamData.displayName,
                abbreviation: teamData.abbreviation,
                city: teamData.location,
                conference: meta.conference || null,
                division: meta.division || null,                
                location: teamData.franchise.venue.address
                    ? `${teamData.franchise.venue.address.city}, ${teamData.franchise.venue.address.state}`
                    : teamData.location,
                logo: teamData.logos?.[0]?.href || null,
                stadium: teamData.franchise.venue?.fullName || null,
                espn_id: teamData.id
            });
        }        

        console.log(detailedTeams);
        return detailedTeams;
    } catch (err) {
        console.error('Error fetching NBA team details:', err.message);
    }
    
};

// Hard coded conferences and divisions
const teamConferenceDivisionMap = {
    BOS: { conference: 'Eastern', division: 'Atlantic' },
    BKN: { conference: 'Eastern', division: 'Atlantic' },
    NY: { conference: 'Eastern', division: 'Atlantic' },
    PHI: { conference: 'Eastern', division: 'Atlantic' },
    TOR: { conference: 'Eastern', division: 'Atlantic' },

    MIL: { conference: 'Eastern', division: 'Central' },
    CHI: { conference: 'Eastern', division: 'Central' },
    CLE: { conference: 'Eastern', division: 'Central' },
    DET: { conference: 'Eastern', division: 'Central' },
    IND: { conference: 'Eastern', division: 'Central' },

    ATL: { conference: 'Eastern', division: 'Southeast' },
    CHA: { conference: 'Eastern', division: 'Southeast' },
    MIA: { conference: 'Eastern', division: 'Southeast' },
    ORL: { conference: 'Eastern', division: 'Southeast' },
    WSH: { conference: 'Eastern', division: 'Southeast' },

    DEN: { conference: 'Western', division: 'Northwest' },
    MIN: { conference: 'Western', division: 'Northwest' },
    OKC: { conference: 'Western', division: 'Northwest' },
    POR: { conference: 'Western', division: 'Northwest' },
    UTAH: { conference: 'Western', division: 'Northwest' },

    GS: { conference: 'Western', division: 'Pacific' },
    LAC: { conference: 'Western', division: 'Pacific' },
    LAL: { conference: 'Western', division: 'Pacific' },
    PHX: { conference: 'Western', division: 'Pacific' },
    SAC: { conference: 'Western', division: 'Pacific' },

    DAL: { conference: 'Western', division: 'Southwest' },
    HOU: { conference: 'Western', division: 'Southwest' },
    MEM: { conference: 'Western', division: 'Southwest' },
    NO: { conference: 'Western', division: 'Southwest' },
    SA: { conference: 'Western', division: 'Southwest' }
}

const seed = async () => {
    try {       
        await mongoose.connect(process.env.MONGO_URI);
        const formatted = await fetchNBATeams();

        await Team.deleteMany({ sport: 'basketball' });
        await Team.insertMany(formatted);
        console.log('NBA teams seeded successfully. ');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding failed: ', err.message);
        process.exit(1);
    }
};

seed();
