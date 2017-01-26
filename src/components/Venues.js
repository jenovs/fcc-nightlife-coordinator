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
          handleAttend={this.handleAttend.bind(this, venue.id, venue.name)}
          user={this.props.user}
          a={this.props.a}
        />
      )
    })
  }

  render() {
    return (
      <div className="venues">
        {this.mapVenues()}
      </div>
    )
  }
}
