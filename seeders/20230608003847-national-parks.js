'use strict';
const express = require('express');
require('dotenv').config();
const apiKey = process.env.NP_API_KEY;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&api_key=${apiKey}`)
      .then(async response => {
        console.log('response', response.data.data);
        const parks = response.data.data.map(p => {
          const result = {
            fullName: p.fullName,
            parkCode: p.parkCode,
            name: p.name,
            designation: p.designation,
            url: p.url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          return result;
        })

        console.log('new parks', parks); // this is an array
        await queryInterface.bulkInsert('parks', parks, {})
      })
      .catch(err => console.log('Error', err))
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('parks', null, {});
  }
};
