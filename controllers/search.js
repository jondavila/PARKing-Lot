require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../models');

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