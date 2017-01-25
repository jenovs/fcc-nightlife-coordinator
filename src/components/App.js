import React from 'react';

import Search from './Search';
import Venues from './Venues';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venues: []
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(str) {
    this.setState({
      venues: []
    });
    fetch(`/api/venues/${str}`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          venues: json
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log('App state', this.state.venues);
    return (
      <div>
        <a href="/auth/twitter">Sign in with Twitter</a>
        <br/>
        <a href="/api/test">Test authentication</a>
        <Search submitSearch={this.handleSearch} />
        <Venues venues={this.state.venues}/>
      </div>
    )
  }
}
