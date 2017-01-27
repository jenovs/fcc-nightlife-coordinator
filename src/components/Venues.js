import React from 'react';

import Venue from './Venue';

export default class Venues extends React.Component {

  handleAttend(id, venueName) {
    this.props.handleAttend(id, venueName);
  }

  mapVenues() {
    return this.props.venues.map((venue, id) => {
      return (
        <Venue
          key={id}
          data={venue}
          handleAttend={this.handleAttend.bind(this, venue.venueId, venue.venueName)}
          user={this.props.user}
        />
      )
    })
  }

  render() {
    if (this.props.searching) {
      return (
        <div className="searching">
          <p>Loading...</p>
        </div>
      )
    } else {
      return (
        <div className="venues">
          {this.mapVenues()}
        </div>)
    }
  }
}
