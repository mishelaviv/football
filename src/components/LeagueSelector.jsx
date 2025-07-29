import React, { Component } from "react";
import axios from "axios";

class LeagueSelector extends Component {
  state = {
    leagues: [],
    selected: ""
  };

  componentDidMount() {
    axios
        .get("https://app.seker.live/fm1/leagues")
        .then((response) => {
          this.setState({ leagues: response.data });
        })
        .catch((error) => {
          console.error("Failed to load leagues:", error);
        });
  }

  onChange = (e) => {
    this.setState({ selected: e.target.value });
    this.props.onSelect(e.target.value);
  };

  render() {
    return (
        <select value={this.state.selected} onChange={this.onChange}>
          <option value="">-- choose league --</option>
          {this.state.leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
          ))}
        </select>
    );
  }
}

export default LeagueSelector;
