import React from 'react';

import Search from './Search';
import Venues from './Venues';
import Header from './Header';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venues: [],
      searching: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleAttend = this.handleAttend.bind(this);
  }

  componentWillMount() {
    const str = sessionStorage.getItem('search');
    if (str) this.handleSearch(str)
    fetch('/api/checkAuth', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(json => this.setState({username: json.username}))
  }

  handleSearch(str) {
    this.setState({
      venues: [],
      search: str,
      searching: true
    });
    sessionStorage.setItem('search', str)
    fetch(`/api/venues/${str}`)
      .then(res => res.json())
      .then(json => {
        console.log('setting search data');
        this.setState({
          venues: json,
          searching: false
        }, this.fetchAttendees)
      })
      .catch(err => console.log(err));
  }

  fetchAttendees() {
    fetch(`/api/attendees/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(this.state.venues)
    })
      .then(data => data.json())
      .then(json => this.setState({venues: json}))
      .catch(err => console.log(err))
  }

  handleAttend(id, venueName) {
    const ind = this.state.venues.findIndex(venue => venue.venueId === id)
    fetch(`/api/attend/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({venueName})
    })
      .then(() => this.fetchAttendees())
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>

        <Header user={this.state.username} />
        <Search submitSearch={this.handleSearch} />
        <Venues searching={this.state.searching}
          venues={this.state.venues}
          handleAttend={this.handleAttend}
          user={this.state.username}/>
      </div>
    )
  }
}
