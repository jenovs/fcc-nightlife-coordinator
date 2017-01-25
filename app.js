const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const session = require('express-session');

const { API_KEY, TW_API_KEY, TW_API_SECRET } = require('./credentials');

const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
  Promise: global.Promise
});

passport.use(new TwitterStrategy({
  consumerKey: TW_API_KEY,
  consumerSecret: TW_API_SECRET,
  callbackURL: 'http://localhost:3000/auth/twitter/callback'
},
  function(token, tokenSecret, profile, done) {
    console.log(profile.id, profile.username);
    done(null, profile.username);
  }));

const app = express();

const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  next();
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Do you even lift?',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('serializeUser');
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser');
  done(null, user);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/', failureRedirect: '/fail'}));

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
  const url = `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${req.params.reference}&maxwidth=200&maxheight=200`
  fetch(url)
    .then(resp => resp.body.pipe(res))
});

app.get('/api/test', checkAuth, (req, res) => {
  console.log(req.session);
  console.log(req.isAuthenticated());
  res.send('You are authenticated!')
});

app.get('*', (req, res) => {
  console.log(req.session);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
