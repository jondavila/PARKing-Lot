require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiKey = process.env.NP_API_KEY;
const mapApiKey = process.env.MAP_API_KEY;

router.get('/:parkCode', (req, res) => {
    axios.get(`https://developer.nps.gov/api/v1/parks?limit=500&parkCode=${req.params.parkCode}&api_key=${apiKey}`)
      .then(response => {
        const park = response.data.data[0];
        const mapUrl = `https://api.mapbox.com/styles/v1/jondav/clidupmg9001q01r74k0r36np.html?title=false&access_token=${mapApiKey}&zoomwheel=false#7/${park.latitude}/${park.longitude}`
        res.render('park', { park, mapUrl });
      })
      .catch(error => {
        console.log('error', error);
        let message = 'Cannot find park. Please try again...';
        res.render('error', { message });
      });
  })

module.exports = router;