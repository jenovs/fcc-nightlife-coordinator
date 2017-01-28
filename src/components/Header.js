import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header>
        <div className="user-login">
          {this.props.user ? <div className="welcome">Welcome @{this.props.user}</div> : <div></div>}

          {!this.props.user ?
            (<div className="login-link">
              <a href="/auth/twitter">Sign in with Twitter</a>
            </div>) :
            (<div className="login-link">
              <a href="/auth/logout">Logout</a>
            </div>)
          }
        </div>

        <div className="header-div">
          <p>Nightlife Coordinator</p>
        </div>
      </header>
    )
  }
}
