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
    this.handleAttend = this.handleAttend.bind(this);


  }

  componentWillMount() {
    // console.log(sessionStorage);
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
      search: str
    });
    sessionStorage.setItem('search', str)
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

  handleAttend(id) {
    fetch(`/api/attend/${id}`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.log(err));
  }

  render() {
    // console.log('App state', this.state);
    return (
      <div>
        {!this.state.username ?
          <a href="/auth/twitter">Sign in with Twitter</a> :
          <span>Welcome @{this.state.username}</span>
        }
        <Search submitSearch={this.handleSearch} />
        <Venues venues={this.state.venues} handleAttend={this.handleAttend} user={this.state.username}/>
      </div>
    )
  }
}
