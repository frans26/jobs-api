require('dotenv').config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const express = require('express');
const app = express();

const mongoose = require('mongoose');

const jobs = require('./routes/jobs');

app.use(express.json());

app.use(jobs);

mongoose.connect(MONGO_URI)
    .then(_ => {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT} in ${process.env.NODE_ENV}`)
        });
    })
    .catch(error => console.error(error))