const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenueSchema = new Schema({
  venueId: {
    type: String,
    unique: true
  },
  venueName: String,
  attendees: [String]
});

module.exports = mongoose.model('venue', VenueSchema);
