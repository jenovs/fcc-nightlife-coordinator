import React from 'react';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: this.props.search,
      venueType: this.props.venueType
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitOnRadio = this.submitOnRadio.bind(this);
  }

  handleChange(e) {
    this.setState({
      search: e.nativeEvent.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.search) {
      this.props.submitSearch(this.state.search, this.state.venueType);
      // this.setState({search: ''});
    }
  }

  submitOnRadio(e) {
    this.setState({
      venueType: e.nativeEvent.target.value
    })
    if (this.state.search) this.props.submitSearch(this.state.search, e.nativeEvent.target.value);
  }

  render() {
    const { venueType } = this.state;
    return (
      <div className="search-div">
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.search} autoFocus placeholder="Enter address to search..."/>
          <button className="btn-search"> &#128270;</button>
          <div className="radios-div" onChange={this.submitOnRadio}>
            <input id="cafe" type="radio" name="venueType" value="cafe" checked={venueType === 'cafe'} onChange={f => f} />
            <label htmlFor="cafe">Cafe</label>
            <input id="gym" type="radio" name="venueType" value="gym" checked={venueType === 'gym'} onChange={f => f} />
            <label htmlFor="gym">Gym</label>
            <input id="park" type="radio" name="venueType" value="park" checked={venueType === 'park'} onChange={f => f} />
            <label htmlFor="park">Park</label>
          </div>
        </form>
      </div>
    )
  }
}
