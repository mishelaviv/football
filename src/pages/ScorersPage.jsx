import React, { Component } from "react";
import axios from "axios";
import LeagueSelector from "../components/LeagueSelector";

class ScorersPage extends Component {
    state = {
        leagueId: "",
        leaders: [],
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
                    const goalCounts = {};

                    response.data.forEach((match) =>
                        match.goals.forEach((g) => {
                            const name = `${g.scorer.firstName} ${g.scorer.lastName}`;
                            goalCounts[name] = (goalCounts[name] || 0) + 1;
                        })
                    );

                    const top3 = Object.entries(goalCounts)
                        .map(([name, goals]) => ({ name, goals }))
                        .sort((a, b) => b.goals - a.goals)
                        .slice(0, 3);

                    this.setState({ leaders: top3, loadedLeague: this.state.leagueId });
                })
                .catch((error) => {
                    console.error("Error loading top scorers:", error);
                });
        }
    }

    handleLeagueSelect = (leagueId) => {
        this.setState({ leagueId });
    };

    render() {
        return (
            <div className="container">
                <h2 className="mb-3">Top 3 Scorers</h2>
                <LeagueSelector onSelect={this.handleLeagueSelect} />

                <ol className="list-group list-group-numbered mt-3">
                    {this.state.leaders.map((player) => (
                        <li
                            key={player.name}
                            className="list-group-item d-flex justify-content-between"
                        >
                            {player.name}
                            <span className="badge bg-primary rounded-pill">
                {player.goals}
              </span>
                        </li>
                    ))}
                </ol>
            </div>
        );
    }
}

export default ScorersPage;
