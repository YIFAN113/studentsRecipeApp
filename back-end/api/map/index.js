
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const GOOGLE_PLACES_API_KEY = "AIzaSyCJ7O0QipjvlxLv8GbYgV6JiH5PoKrBcJk";

router.get('/nearbyshops', async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing latitude or longitude parameters' });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=store&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const apiResponse = await fetch(apiUrl);
    const apiResponseJson = await apiResponse.json();

    if (apiResponseJson.error_message) {
      return res.status(500).json({ error: apiResponseJson.error_message });
    }

    res.json(apiResponseJson.results);
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;