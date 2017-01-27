import React from 'react';

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      search: e.nativeEvent.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.search) {
      this.props.submitSearch(this.state.search);
      this.setState({search: ''});
    }
  }

  render() {
    return (
      <div className="search-div">
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.handleChange} value={this.state.search} autoFocus placeholder="Enter address to search..."/>
          <button className="btn-search">&#128270;</button>
        </form>
      </div>
    )
  }
}
