const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Venue = require('./models/Venue');
const { API_KEY, TW_API_KEY, TW_API_SECRET } = require('./credentials');

const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
  Promise: global.Promise
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/GymLife');

passport.use(new TwitterStrategy({
  consumerKey: TW_API_KEY,
  consumerSecret: TW_API_SECRET,
  callbackURL: 'http://localhost:3000/auth/twitter/callback'
},
  function(token, tokenSecret, profile, done) {
    done(null, [profile.id, profile.username]);
  }));

const app = express();
app.use(bodyParser.json());

const checkAuth = (req, res, next) => {
  console.log('===checkAuth, req.session.passport:', req.session.passport);

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
    console.log('===twitter callback', req.session);
    // req.session.user = req.session.passport.user;
    res.redirect('/');
  }
);

const getImgSrc = (ref) => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${ref}&maxwidth=100&maxheight=100`;
  return fetch(url)
}

// Search Google Places by address
app.get('/api/venues/:addr', (req, res) => {
  // console.log(req.params.addr)
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
    // List of places received
    .then(data => {
      req.rawData = data.json.results;
      // Check if there are corresponding records in db
      const promArr = data.json.results.map(result => {
        return Venue.findOne({venueId: result.id})
      })
      return Promise.all(promArr)
    })
    // Merge list of attendees with fetched data
    .then(dbData => {
      let attendList = {}
      dbData.map(i => {
        if (i) attendList[i.venueId] = i.attendees;
      })
      req.rawData = req.rawData.map((venue, i, arr) => {
        venue.attendees = attendList[venue.id] || [];
        return venue;
      })
      return;
    })
    // Get src for images
    .then(() => {
      return new Promise((resolve) => {
        let temp = {};
        const len = req.rawData.length;
        count = 0;
        req.rawData.forEach(i => {
          if (i.photos) {
            getImgSrc(i.photos[0].photo_reference).then(data => {
              temp[i.id] = data.url
              count++;
              if (count === len) resolve(temp)
            })
          } else {
            count++;
          }
        });
      });
    })
    // Filter fetched array and add img src
    .then(imgSrc => {
      let results = [];
      req.rawData.forEach(i => {
        const result = {
          venueName: i.name,
          venueId: i.id,
          venueAddress: i.vicinity,
          rating: i.rating || null,
          imgSrc: i.photos && imgSrc[i.id],
          imgRef: i.photos && i.photos[0].html_attributions[0],
        }
        results.push(result);
      })
      return results;
    })
    .then(results => res.send(results))
    .catch(err => console.log(err));
});

// app.get('/api/img/:reference', (req, res) => {
//   const url = `https://maps.googleapis.com/maps/api/place/photo?key=${API_KEY}&photoreference=${req.params.reference}&maxwidth=100&maxheight=100`
//   fetch(url)
//     .then(resp => resp.body.pipe(res))
// });

app.get('/api/attend/:venueId', (req, res) => {
  console.log(req.params.venueId);
  Venue.findOne({venueId: req.params.venueId})
    .then(data => {
      if (!data) return res.send({attendees: 0})
      res.send({attendees: data.attendees.length})
    })
    .catch(err => console.log(err));
});

app.post('/api/attend/:venueId', checkAuth, (req, res) => {
  console.log(req.params.venueId);
  console.log(req.session.passport.user[1]);
  console.log('req.body', req.body);
  Venue.findOne({venueId: req.params.venueId})
    .then(data => {
      if (!data) {
        const newVenue = new Venue({
          venueId: req.params.venueId,
          venueName: req.body.venueName,
          attendees: [req.session.passport.user[1]]
        })
        return newVenue.save();
      } else {
        if (data.attendees.indexOf(req.session.passport.user[1]) !== -1) return data;
        data.attendees.push(req.session.passport.user[1])
        const updatedData = {
          venueId: data.venueId,
          venueName: data.venueName,
          attendees: data.attendees
        }
        return Venue.findOneAndUpdate({venueId: data.venueId}, updatedData)
      }
      // console.log(data);
    })
    .then(data => res.send({attendees: data.attendees.length}))
  // res.send({attendees: 1});
});

app.get('/api/checkAuth', checkAuth, (req, res) => {
  console.log('===GET checkAuth', req.session);
  res.send({username: req.session.passport.user[1]})
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server started on port 3000...');
});
