import React from 'react';

export default class Venue extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      image: null,
      attribute: null
    }
  }

  componentDidMount() {
    this.fetchImage();
  }

  fetchImage() {
    if (this.props.data.photos) {
      fetch(`/api/img/${this.props.data.photos[0].photo_reference}`)
      .then(res => res.blob())
      .then(blob => {
        const img = new Image();
        const src = URL.createObjectURL(blob)
        this.setState({
          image: src,
          attribute: this.props.data.photos[0].html_attributions[0]
        })
      })
    } else {
      this.setState({
        image: '/img/noPhoto.png'
      })
    }
  }

  render() {
    console.log(this.state.attribute);
    return (
      <div className="container-venue">
        <img src={this.state.image} className="img-venue"/>
        <div className="venue-descr">
          <div className="venue-name">
            {this.props.data.name}
          </div>
          <div>
            {this.props.data.vicinity}
          </div>
          <div className="attr-data">
            <div className="photo-attribute">
              {this.state.attribute && <span>Photo by: <span dangerouslySetInnerHTML={{__html: this.state.attribute}}></span></span>}
            </div>
            <div>
              <button className="btn">Attend</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
