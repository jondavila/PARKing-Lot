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

router.get('/', isLoggedIn, (req, res) => {
    const { id, name, email } = req.user.get();
    res.render('profile', { id, name, email });
});

router.get('/favorites', isLoggedIn, (req, res) => {
    const { id, name, email } = req.user.get();
    db.user.findOne({
        where: {
            id: id
        }
    })
        .then(user => {
            user.getParks()
                .then(parks => {
                    if (parks.length > 0) {
                        res.render('favorites', { id, name, email, parks })
                    } else {
                        res.render('favorites', { id, name, email, parks: [] })
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    let message = 'Cannot load parks. Please try again later...';
                    res.render('error', { message });
                });
        })
        .catch(error => {
            console.log('error', error);
            let message = 'Cannot find user. Please try again later...';
            res.render('error', { message });
        })
})

router.get('/remove/:parkCode', isLoggedIn, (req, res) => {
    db.user.findOne({ where: { id: req.user.id } })
        .then(user => {
            db.park.findOne({ where: { parkCode: req.params.parkCode } })
                .then(park => {
                    user.removePark(park)
                        .then(relationInfo => {
                            res.redirect('/profile/favorites');
                        })
                        .catch(error => {
                            console.log('error', error);
                            let message = 'Cannot add park. Please try again...';
                            res.render('error', { message });
                        });
                })
                .catch(error => {
                    console.log('error', error);
                    let message = 'Cannot find park. Please try again...';
                    res.render('error', { message });
                });
        })
        .catch(error => {
            console.log('error', error);
            let message = 'Cannot find user. Please try again...';
            res.render('error', { message });
        });
})


router.post('/', isLoggedIn, (req, res) => {
    // console.log('req.code', req.body.code);
    // res.json({ message: req.body})
    db.user.findOne({ where: { id: req.user.id } })
        .then(user => {
            db.park.findOne({ where: { parkCode: req.body.code } })
                .then(park => {
                    user.addPark(park)
                        .then(relationInfo => {
                            res.redirect('/profile');
                        })
                        .catch(error => {
                            console.log('error', error);
                            let message = 'Cannot add park. Please try again...';
                            res.render('error', { message });
                        });
                })
                .catch(error => {
                    console.log('error', error);
                    let message = 'Cannot find park. Please try again...';
                    res.render('error', { message });
                });
        })
        .catch(error => {
            console.log('error', error);
            let message = 'Cannot find user. Please try again...';
            res.render('error', { message });
        });
})

module.exports = router;