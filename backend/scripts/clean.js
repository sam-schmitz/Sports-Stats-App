// clean.js
// By: Sam Schmitz
// Used to clean db of bad data

const clean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Player.deleteMany({ team: 'Arsenal' });

        mongoose.disconnect();
    } catch (err) {
        console.error('Error cleaning database', err.message);
        process.exit(1);
    }
}

clean();
