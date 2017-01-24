import React from 'react';

export default class Venue extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      image: null
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
          image: src
        })
      })
    } else {
      this.setState({
        image: '/img/noPhoto.png'
      })
    }
  }

  render() {

    return (
      <div>
        {this.props.data.name}
        <img src={this.state.image} />
      </div>
    )
  }
}
