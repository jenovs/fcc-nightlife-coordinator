import React from 'react';

import Venue from './Venue';

export default class Venues extends React.Component {

  mapVenues() {
    return this.props.venues.map((venue, id) => {
      return (
        <Venue key={id} data={venue} />
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
