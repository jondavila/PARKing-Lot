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
//     try {
//         const newPark = await db.park.create({
//             name: "My Name",
//             email: "myemail@gmail.com"
//         });
//         console.log('my new user >>>', newUser);
//     } catch (error) {
//         console.log('new user was not created b/c of >>>', error);
//     }
    
}
// @todo run createUser function below
// createPark();

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
// @todo run findOneUser function below
// findOnePark();

// find all users
// async function findAllUsers() {
//     try {
//         const users = await db.user.findAll();
//         console.log('all users here >>>', users);  
//     } catch (error) {
//         console.log('did not find all users because of >>>', error);
//     }
// }
// @todo run findAllUsers function below

// find one user
// async function findOrCreate() {
//     try {
//         const users = await db.user.findOrCreate({
//             where: { email: 'brainsmith@gmail.com' },
//             defaults: {
//                 name: 'Brian Smith',
//             },
//         });
//         console.log('all users here >>>', users);  
//     } catch (error) {
//         console.log('did not find all users because of >>>', error);
//     }
// }
// @todo run findOrCreate function below

// UPDATE
// async function updateUser() {
//     try {
//         const numRowsUpdated = await db.user.update({
//             name: 'Brain Taco'
//         }, {
//             where: {
//                 email: 'brainsmith@gmail.com'
//             }
//         });
//         console.log('number of users updated', numRowsUpdated);
//     } catch (error) {
//         console.log('did not update user(s) because of >>>', error);
//     }
// }
// @todo run updateUser function below

// DELETE
// async function deleteUser() {
//     try {
//         let numOfRowsDeleted = await db.user.destroy({
//             where: { email: 'brainsmith@gmail.com' }
//         });
//         console.log('number of rows deleted >>>', numOfRowsDeleted);
//     } catch (error) {
//         console.log('did not delete user(s) because of >>>', error);
//     }
// }
// @todo run deleteUser function below