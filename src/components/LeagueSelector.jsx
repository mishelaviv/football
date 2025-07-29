import React, { Component } from "react";
import axios from "axios";

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
    axios
        .get("https://app.seker.live/fm1/leagues")
        .then((res) => {
          this.setState({ leagues: res.data });
        })
        .catch((err) => {
          console.error("Error loading leagues:", err);
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
