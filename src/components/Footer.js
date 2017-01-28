import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p>Fullstack project for FreeCodeCamp.</p>
        <p>Created using Node, Express, React, MongoDB, Google API.</p>
        <a href="https://github.com/jenovs/fcc-nightlife-coordinator"
          target="_blank">Source code on GitHub</a>
      </footer>
    )
  }
}
