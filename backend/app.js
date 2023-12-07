const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();


// Load Route files
const user_routes = require('./src/routes/user');
const renter_routes = require('./src/routes/renter');


// Load Renter Daily Updates File
const updateDailyRentersData = require('./src/controllers/renter-daily-updates');


// Calls the function `updateDailyRentersData` every day at 08:00 in the Colombian time zone
cron.schedule('0 8 * * *', () => {
    updateDailyRentersData();
}, {
    scheduled: true,
    timezone: 'America/Bogota'
});


// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// CORS
app.use(cors());


// Routes
app.use('/api', user_routes);
app.use('/api', renter_routes);


// Export
module.exports = app;