import React, { Component } from "react";
import { getLeagues } from "../api";

class LeagueSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagues: [],
      chosen: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    getLeagues().then((res) => {
      this.setState({ leagues: res.data });
    });
  }

  handleChange(e) {
    const selectedValue = e.target.value;
    this.setState({ chosen: selectedValue });
    this.props.onSelect(selectedValue);
  }

  render() {
    const { leagues, chosen } = this.state;

    return (
        <select value={chosen} onChange={this.handleChange}>
          <option value="">-- choose league --</option>
          {leagues.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
          ))}
        </select>
    );
  }
}

export default LeagueSelector;
