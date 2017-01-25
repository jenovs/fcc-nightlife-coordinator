const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const { API_KEY } = require('./credentials');
const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
  Promise: global.Promise
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/venues/:addr', (req, res) => {
  console.log(req.params.addr)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(req.params.addr)}&key=${API_KEY}`
  let lat, lon;
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      lat = data.results[0].geometry.location.lat;
      lon = data.results[0].geometry.location.lng;
      return {lat, lon}
    })
    .then(coords => {
      return googleMapsClient.placesNearby({
        location: [coords.lat, coords.lon],
        radius: 5000,
        type: 'gym'
      }).asPromise()
    })
    .then(data => {
      res.json(data.json.results)
    })
    .catch(err => console.log(err));
});

app.get('/api/img/:reference', (req, res) => {
  // res.set('Content-Type', 'image');
  const url = `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${req.params.reference}&maxwidth=200&maxheight=200`
  fetch(url)
    .then(resp => resp.body.pipe(res))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
