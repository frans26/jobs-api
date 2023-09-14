require('dotenv').config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');

const mongoose = require('mongoose');

const jobs = require('./routes/jobs');

app.use(express.json());
app.use(jobs);

app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

app.use(errorMiddleware);


mongoose.connect(MONGO_URI)
    .then(_ => {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT} in ${process.env.NODE_ENV}`)
        });
    })
    .catch(error => console.error(error));
