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
          username={this.props.username}
        />
      )
    })
  }

  render() {
    if (this.props.searching) {
      return (
        <div className="venues searching">
          <p>Loading {this.props.venueType}s in <span style={{'textTransform': 'capitalize'}}>{this.props.search}</span>...</p>
        </div>
      )
    } else if (!this.props.searching && this.props.noResults) {
      return (
        <div className="venues searching">
          <p>Nothing found :(</p>
        </div>
      )
    } else if (!this.props.venues.length) {
      return (
        <div className="venues descr">
          <p>Search a cafe, gym or a park and see who's attending.</p>
        </div>)
    } else {
      return (
        <div className="venues">
          {this.mapVenues()}
        </div>)
    }
  }
}
