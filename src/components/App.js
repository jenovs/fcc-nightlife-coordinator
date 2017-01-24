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
    return (
      <div>
        <Search submitSearch={this.handleSearch} />
        <Venues venues={this.state.venues}/>
      </div>
    )
  }
}