const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');


router.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://developer.nps.gov/api/v1/parks?limit=500&api_key=LLfEE5dwUeQsATIuQyWd34TWRXi3P4Zo2rDEMGDk")
        res.json(response.data)
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router;