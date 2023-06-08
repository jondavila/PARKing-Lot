require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const apiKey = process.env.NP_API_KEY;

router.get('/', (req, res) => {
    let message = "Search needed to view results. Please return to the home page."
    return res.render('error', { message })
})

router.post('/', (req, res) => {
    const parsedCategory = { ...req.body };
    console.log(parsedCategory);
    if (!parsedCategory.code && !parsedCategory.designation) {
        let message = 'Please input a search request'
        res.render('error', { message });
    } else if (parsedCategory.code) {
        axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&parkCode=${parsedCategory.code}&api_key=${apiKey}`)
            .then(response => {
                let foundPark = response.data.data; // returns an array with one element
                return res.render('result', { data: foundPark });
            })
            .catch(error => {
                console.log('error', error);
                let message = 'Cannot find park. Please try again...';
                res.render('error', { message });
            });
    } else if (parsedCategory.designation) {
        db.park.findAll({
            where: {
                designation: parsedCategory.designation
            },
            order: [
                ['name', 'ASC']
            ]
        })
            .then(foundParks => {
                const cleanedData = foundParks.map(park => park.toJSON()); // returns an array
                // console.log('found parks', cleanedData);
                return res.render('result', { data: cleanedData });
            })
            .catch(error => {
                console.log('error', error);
                let message = `Cannot find parks that match ${parsedCategory.designation}`;
                res.render('error', { message });
            });
    }
})


module.exports = router;