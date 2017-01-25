import React from 'react';

import Venue from './Venue';

export default class Venues extends React.Component {

  handleAttend(id) {
    this.props.handleAttend(id);
  }

  mapVenues() {
    return this.props.venues.map((venue, id) => {
      return (
        <Venue
          key={id}
          data={venue}
          handleAttend={this.handleAttend.bind(this, venue.id)}
          user={this.props.user}
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
