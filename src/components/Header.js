import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header>
        {!this.props.user ?
          <a href="/auth/twitter">Sign in with Twitter</a> :
          <span>Welcome @{this.props.user}</span>
        }
        <div className="header-div">
          <p>GymLife Coordinator</p>
        </div>
      </header>
    )
  }
}
