// app.js
//By: Sam Schmitz
//The app of the back end for the sports statistics tracker

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({path: __dirname + '/.env'});

//app set up
const app = express();
app.use(cors());
app.use(express.json());

//MongoDB connection
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected locally via Docker'))
    .catch(err => console.error('MongoDB connection error:', err));
