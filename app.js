const express = require('express');
const path = require('path');

const { API_KEY } = require('./credentials');
const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
  Promise: global.Promise
});

// Temp fixed location
const lat = require('./credentials').latitude;
const lon = require('./credentials').longitude;

const app = express();

app.get('/', (req, res) => {
  googleMapsClient.placesNearby({
    location: [lat, lon],
    radius: 10000,
    type: 'cafe'
  }).asPromise()
    .then(data => res.json(data.json))
    .catch(err => console.log(err))

})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Server started on port 3000...');
})
