import React, { Component } from "react";
import LeagueSelector from "../components/LeagueSelector";
import { getHistory } from "../api";

class HistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagueId: "",
      games: [],
      minR: "",
      maxR: ""
    };

    this.handleLeagueSelect = this.handleLeagueSelect.bind(this);
    this.handleMinChange = this.handleMinChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.leagueId !== this.state.leagueId && this.state.leagueId) {
      getHistory(this.state.leagueId).then((res) => {
        this.setState({ games: res.data });
      });
    }
  }

  handleLeagueSelect(leagueId) {
    this.setState({ leagueId });
  }

  handleMinChange(e) {
    this.setState({ minR: e.target.value });
  }

  handleMaxChange(e) {
    this.setState({ maxR: e.target.value });
  }

  render() {
    const { games, minR, maxR } = this.state;

    const shown = games.filter((g) =>
        (minR === "" || g.round >= +minR) &&
        (maxR === "" || g.round <= +maxR)
    );

    return (
        <div className="container">
          <h2 className="mb-3">Match History</h2>
          <LeagueSelector onSelect={this.handleLeagueSelect} />

          {games.length > 0 && (
              <>
                <div className="my-3">
                  Round&nbsp;
                  <input
                      type="number"
                      className="form-control d-inline-block"
                      style={{ width: 90 }}
                      value={minR}
                      onChange={this.handleMinChange}
                  />
                  &nbsp;to&nbsp;
                  <input
                      type="number"
                      className="form-control d-inline-block"
                      style={{ width: 90 }}
                      value={maxR}
                      onChange={this.handleMaxChange}
                  />
                </div>

                <ul className="list-group">
                  {shown.map((m) => {
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
