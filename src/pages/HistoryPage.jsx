import React, { Component } from "react";
import axios from "axios";
import LeagueSelector from "../components/LeagueSelector";

class HistoryPage extends Component {
  state = {
    leagueId: "",
    loadedLeague: "",
    games: [],
    minR: "",
    maxR: ""
  };

  componentDidUpdate() {
    if (
        this.state.leagueId &&
        this.state.leagueId !== this.state.loadedLeague
    ) {
      axios
          .get(`https://app.seker.live/fm1/history/${this.state.leagueId}`)
          .then((response) => {
            this.setState({
              games: response.data,
              loadedLeague: this.state.leagueId
            });
          })
          .catch((error) => {
            console.error("Error fetching history:", error);
          });
    }
  }

  handleLeagueSelect = (leagueId) => {
    this.setState({ leagueId });
  };

  handleMinChange = (e) => {
    this.setState({ minR: e.target.value });
  };

  handleMaxChange = (e) => {
    this.setState({ maxR: e.target.value });
  };

  render() {
    const filteredGames = this.state.games.filter(
        (g) =>
            (this.state.minR === "" || g.round >= +this.state.minR) &&
            (this.state.maxR === "" || g.round <= +this.state.maxR)
    );

    return (
        <div className="container">
          <h2 className="mb-3">Match History</h2>
          <LeagueSelector onSelect={this.handleLeagueSelect} />

          {this.state.games.length > 0 && (
              <>
                <div className="my-3 d-flex align-items-center gap-2">
                  <label className="mb-0">Round</label>
                  <input
                      type="number"
                      className="form-control"
                      style={{ width: 90 }}
                      value={this.state.minR}
                      onChange={this.handleMinChange}
                  />
                  <span>to</span>
                  <input
                      type="number"
                      className="form-control"
                      style={{ width: 90 }}
                      value={this.state.maxR}
                      onChange={this.handleMaxChange}
                  />
                </div>

                <ul className="list-group">
                  {filteredGames.map((m) => {
                    const h = m.goals.filter((g) => g.home).length;
                    const a = m.goals.length - h;

                    return (
                        <li key={m.id} className="list-group-item">
                          {m.homeTeam.name} {h} – {a} {m.awayTeam.name}
                          <span className="badge bg-secondary float-end">
                      R{m.round}
                    </span>
                        </li>
                    );
                  })}
                </ul>
              </>
          )}
        </div>
    );
  }
}

export default HistoryPage;
