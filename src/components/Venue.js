import React from 'react';

export default class Venue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgSrc: null,
      imgClass: 'img-venue loading',
      username: this.props.username,
      attending: false
    }
  }

  componentWillMount() {
    if (this.props.data.imgSrc) {
      fetch(`/api/fetchImg/${this.props.data.imgSrc}`)
        .then(data => data.text())
        .then(imgSrc => this.setState({
          imgSrc,
          imgClass: 'img-venue'
        }))
    } else {
      this.setState({
        imgSrc: '/img/noPhoto.png',
        imgClass: 'img-venue'
      })
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.username) {
      const ind = newProps.data.attendees.indexOf(newProps.username);
      if (ind !== -1) this.setState({attending: true})
      else this.setState({attending: false})
    }
  }

  render() {
    const { venueName, venueAddress, imgRef, imgSrc, rating, attendees } = this.props.data;
    const username = this.props.username;
    const attending = this.state.attending;
    const handleAttend = this.props.handleAttend;
    const btnClass = this.state.attending ? 'btn btn-danger' : 'btn btn-primary';

    return (
      <div className="venue-container">
        <img src={this.state.imgSrc || '/img/loading.png'} className={this.state.imgClass}/>
        <div className="venue-descr">
          <div className="venue-name">
            {venueName}
          </div>
          <div>
            {venueAddress}
          </div>
          <div className="will-attend">
            {attendees.length} will attend.
          </div>
          <div className="attr-data">
            <div className="photo-attribute">
              {imgRef && <span>Photo by: <span dangerouslySetInnerHTML={{__html: imgRef}}></span></span>}
            </div>
            <div>
              {this.props.username ?
                <button className={btnClass} onClick={this.props.handleAttend}>{this.state.attending ? 'Remove' : 'Attend'}</button>:
                <a className="btn btn-primary" href="/auth/twitter">Attend</a>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
