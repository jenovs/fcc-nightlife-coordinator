const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const { API_KEY } = require('./credentials');
const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
  Promise: global.Promise
});

const app = express();

app.get('/api/venues/:addr', (req, res) => {
  console.log(req.params.addr)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(req.params.addr)}&key=${API_KEY}`
  let lat, lon;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      lat = data.results[0].geometry.location.lat;
      lon = data.results[0].geometry.location.lng;
      return {lat, lon}
    })
    .then(coords => {
      return googleMapsClient.placesNearby({
        location: [coords.lat, coords.lon],
        radius: 5000,
        type: 'cafe'
      }).asPromise()
    })
    .then(data => {
      console.log(data.json.results.length);
      res.json(data.json)
    })
    .catch(err => console.log(err));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
