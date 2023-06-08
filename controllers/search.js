require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const router = express.Router();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('../config/ppConfig');
const isLoggedIn = require('../middleware/isLoggedIn');
const axios = require('axios');
const db = require('../models');
const apiKey = process.env.NP_API_KEY;
const mapApiKey = process.env.MAP_API_KEY;

router.get("/", (req, res) => {
    db.park.findAll({
        order: [
            ['name', 'ASC']
        ]
    })
        .then(parks => {
            cleanedParks = parks.map(park => park.toJSON());
            let designations = [];
            cleanedParks.forEach(park => {
                if (!designations.includes(park.designation)) {
                    designations.push(park.designation)
                }
            });
            return res.render('search', { parks: cleanedParks, designations });
        })
        .catch(error => {
            console.log('error', error);
            let message = 'Cannot find data. Please try again...';
            res.render('error', { message });
        });
})

module.exports = router;