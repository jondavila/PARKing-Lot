require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('./models');

const apiKey = process.env.API_KEY

// Implement CRUD for user model

// CREATE
async function createPark() {
    axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&api_key=${apiKey}`)
    .then((response) => {
        // console.log('response.data.data', response.data.data);
        let parkCount = 0;
        let parkDesignation = [];
        response.data.data.forEach(newPark => {
            db.park.create({
                fullName: newPark.fullName,
                parkCode: newPark.parkCode,
                name: newPark.name,
                designation: newPark.designation,
                url: newPark.url
            })
            .then(createdPark => {
                console.log('created Park', createdPark.name)
            })
            .catch(error => {
                console.log('error', error);
            })
        });
    })
    .catch(error => {
        console.log('error', error);
    })
}

// READ
// find one user
async function findOnePark() {
   db.park.findOne({
    where: {parkCode: 'abli'}
   })
   .then(foundPark => {
    console.log('found park', foundPark.toJSON());
   })
   .catch(error => {
    console.log('error', error);
   })
}