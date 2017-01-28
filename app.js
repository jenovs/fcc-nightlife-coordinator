require('./config/config');

console.log('Process:', process.env.NODE_ENV);

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Venue = require('./models/Venue');

const {
  API_KEY,
  MONGODB_URI,
  PORT,
  TW_API_KEY,
  TW_API_SECRET,
  TW_CALLBACK_URL,
} = process.env;

const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
  Promise: global.Promise
});

const getImgSrc = (ref) => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${ref}&maxwidth=100&maxheight=100`;
  return fetch(url)
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

passport.use(new TwitterStrategy({
  consumerKey: TW_API_KEY,
  consumerSecret: TW_API_SECRET,
  callbackURL: TW_CALLBACK_URL
},
  function(token, tokenSecret, profile, done) {
    done(null, [profile.id, profile.username]);
  }));

const app = express();
app.use(bodyParser.json());

const checkAuth = (req, res, next) => {
  // console.log('===checkAuth, req.session.passport:', req.session.passport);
  if (!req.isAuthenticated()) return res.send({username: null});
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
  console.log('===serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('===deserializeUser', user);
  done(null, user);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {failureRedirect: '/fail'}),
  (req, res, next) => {
    // console.log('===twitter callback', req.session);
    // req.session.user = req.session.passport.user;
    res.redirect('/');
  }
);

app.get('/api/venues/:addr', (req, res) => {
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
        radius: 3000,
        type: 'gym'
      }).asPromise()
    })

    .then(data => {
      const results = [];
      data.json.results.forEach(i => {
        const result = {
          venueName: i.name,
          venueId: i.id,
          venueAddress: i.vicinity,
          rating: i.rating || null,
          imgSrc: i.photos && i.photos[0].photo_reference,
          imgRef: i.photos && i.photos[0].html_attributions[0],
          attendees: []
        }
        results.push(result);
      })
      res.send(results)
    })
});

app.get('/api/fetchImg/:id', (req, res) => {
  getImgSrc(req.params.id).then(data => res.send(data.url));
});

app.post('/api/attendees', (req, res) => {
  const promArr = req.body.map(result => {
    return Venue.findOne({venueId: result.venueId})
  })
  Promise.all(promArr)
    .then(dbData => {
      let attendList = {}
      dbData.forEach(i => {
        // console.log(i);
        if (i) attendList[i.venueId] = i.attendees;
      })
      // console.log(attendList);
      const results = req.body.map((venue, i) => {
        venue.attendees = attendList[venue.venueId] || [];
        return venue;
      })
      return results;
    })
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

app.post('/api/attend/:venueId', checkAuth, (req, res) => {
  Venue.findOne({venueId: req.params.venueId})
    .then(data => {
      if (!data) {
        const venue = new Venue({
          venueId: req.params.venueId,
          venueName: req.body.venueName,
          attendees: [req.session.passport.user[1]]
        })
        return venue.save();
      } else {
        const userInd = data.attendees.indexOf(req.session.passport.user[1])
        if (userInd !== -1) {
          data.attendees.splice(userInd, 1);
        } else {
          data.attendees.push(req.session.passport.user[1])
        }
        const updatedData = {
          venueId: data.venueId,
          venueName: data.venueName,
          attendees: data.attendees
        }
        return Venue.findOneAndUpdate({venueId: data.venueId}, updatedData)
      }
    })
    .then(() => res.send())
});

app.get('/api/checkAuth', checkAuth, (req, res) => {
  console.log('===GET checkAuth', req.session);
  res.send({username: req.session.passport.user[1]})
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
