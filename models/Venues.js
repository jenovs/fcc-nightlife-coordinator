const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenuesSchema = new Schema({
  venueId: {
    type: String,
    unique: true
  },
  attendees: [String]
});

module.exports = mongoose.model('venue', VenuesSchema);
