import React, { Component } from "react";
import axios from "axios";
import LeagueSelector from "../components/LeagueSelector";

class StatsPage extends Component {
  state = {
    leagueId: "",
    stats: null,
    loadedLeague: ""
  };

  componentDidUpdate() {
    if (
        this.state.leagueId &&
        this.state.leagueId !== this.state.loadedLeague
    ) {
      axios
          .get(`https://app.seker.live/fm1/history/${this.state.leagueId}`)
          .then((response) => {
            this.calculateStats(response.data);
            this.setState({ loadedLeague: this.state.leagueId });
          })
          .catch((error) => {
            console.error("Error loading stats:", error);
          });
    }
  }

  handleLeagueSelect = (leagueId) => {
    this.setState({ leagueId });
  };

  calculateStats(games) {
    let firstHalf = 0,
        secondHalf = 0,
        earliest = 120,
        latest = 0;
    const goalsPerRound = {};

    games.forEach((match) => {
      const round = match.round;
      const totalGoals = match.goals.length;
      goalsPerRound[round] = (goalsPerRound[round] || 0) + totalGoals;

      match.goals.forEach((g) => {
        const min = g.minute;
        if (min <= 45) firstHalf++;
        else secondHalf++;
        if (min < earliest) earliest = min;
        if (min > latest) latest = min;
      });
    });

    const entries = Object.entries(goalsPerRound);
    const [mostR] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    const [leastR] = entries.reduce((a, b) => (b[1] < a[1] ? b : a));

    this.setState({
      stats: { firstHalf, secondHalf, earliest, latest, mostR, leastR }
    });
  }

  render() {
    return (
        <div className="container">
          <h2 className="mb-3">League Statistics</h2>
          <LeagueSelector onSelect={this.handleLeagueSelect} />

          {this.state.stats && (
              <ul className="list-group mt-3">
                <li className="list-group-item">
                  Goals 1st half: <strong>{this.state.stats.firstHalf}</strong>
                </li>
                <li className="list-group-item">
                  Goals 2nd half: <strong>{this.state.stats.secondHalf}</strong>
                </li>
                <li className="list-group-item">
                  Earliest goal minute: <strong>{this.state.stats.earliest}'</strong>
                </li>
                <li className="list-group-item">
                  Latest goal minute: <strong>{this.state.stats.latest}'</strong>
                </li>
                <li className="list-group-item">
                  Round with most goals: <strong>{this.state.stats.mostR}</strong>
                </li>
                <li className="list-group-item">
                  Round with fewest goals: <strong>{this.state.stats.leastR}</strong>
                </li>
              </ul>
          )}
        </div>
    );
  }
}

export default StatsPage;
