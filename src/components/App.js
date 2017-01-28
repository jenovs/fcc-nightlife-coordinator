import React from 'react';

import Search from './Search';
import Venues from './Venues';
import Header from './Header';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noResults: false,
      search: '',
      venues: [],
      searching: false,
      venueType: 'cafe'
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleAttend = this.handleAttend.bind(this);
  }

  componentWillMount() {
    const storage = JSON.parse(sessionStorage.getItem('search'));
    let search, venueType;
    // console.log(x);
    if (storage) ({ search, venueType } = storage);
    // const { search, venueType } = JSON.parse(sessionStorage.getItem('search')) ;
    // const str = JSON.parse(sessionStorage.getItem('search')).search;
    // const venueType =
    // console.log(search, venueType);
    if (search) this.handleSearch(search, venueType)
    fetch('/api/checkAuth', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(json => this.setState({username: json.username}))
  }

  handleSearch(search, venueType) {
    console.log('App searching for:', search, venueType);
    this.setState({
      venueType,
      search,
      noResults: false,
      venues: [],
      searching: true,
    });
    sessionStorage.setItem('search', JSON.stringify({search: search, venueType: venueType}))
    fetch(`/api/venues/${search}/${venueType}`)
      .then(res => res.json())
      .then(json => {
        if (!json.error) {
          console.log('setting search data');
          this.setState({
            venues: json,
            searching: false
          }, this.fetchAttendees)
        } else {
          console.log('nothing found :(');
          this.setState({
            noResults: true,
            searching: false
          })
        }
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
    console.log('App state', this.state);
    return (
      <div>

        <Header user={this.state.username} />
        <Search submitSearch={this.handleSearch}
          search={this.state.search}
          venueType={this.state.venueType}/>
        <Venues searching={this.state.searching}
          noResults={this.state.noResults}
          venues={this.state.venues}
          handleAttend={this.handleAttend}
          user={this.state.username}/>
      </div>
    )
  }
}
