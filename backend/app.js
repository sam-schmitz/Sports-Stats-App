// app.js
//By: Sam Schmitz
//The app of the back end for the sports statistics tracker

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });    //use just .config(); if in backend folder
const http = require('http');
const { Server } = require('socket.io');
const teamsRouter = require('./routes/teams');
const playersRouter = require('./routes/players');
const gamesRouter = require('./routes/games');

//app set up
const app = express();
app.use(cors());
app.use(express.json());
app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/games', gamesRouter);

//MongoDB connection
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected locally via Docker'))
    .catch(err => console.error('MongoDB connection error:', err));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('disconect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
