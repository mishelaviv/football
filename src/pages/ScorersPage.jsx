import React, { Component } from "react";
import axios from "axios";
import LeagueSelector from "../components/LeagueSelector";

class ScorersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leagueId: "",
            leaders: []
        };

        this.handleLeagueSelect = this.handleLeagueSelect.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.leagueId !== this.state.leagueId && this.state.leagueId) {
            axios
                .get(`https://app.seker.live/fm1/history/${this.state.leagueId}`)
                .then((res) => {
                    const tally = {};
                    res.data.forEach((match) =>
                        match.goals.forEach((g) => {
                            const name = `${g.scorer.firstName} ${g.scorer.lastName}`;
                            tally[name] = (tally[name] || 0) + 1;
                        })
                    );
                    const top3 = Object.entries(tally)
                        .map(([name, goals]) => ({ name, goals }))
                        .sort((a, b) => b.goals - a.goals)
                        .slice(0, 3);

                    this.setState({ leaders: top3 });
                })
                .catch((err) => {
                    console.error("Error fetching history:", err);
                });
        }
    }

    handleLeagueSelect(leagueId) {
        this.setState({ leagueId });
    }

    render() {
        const { leaders } = this.state;

        return (
            <div className="container">
                <h2 className="mb-3">Top 3 Scorers</h2>
                <LeagueSelector onSelect={this.handleLeagueSelect} />

                <ol className="list-group list-group-numbered mt-3">
                    {leaders.map((p) => (
                        <li
                            key={p.name}
                            className="list-group-item d-flex justify-content-between"
                        >
                            {p.name}
                            <span className="badge bg-primary rounded-pill">{p.goals}</span>
                        </li>
                    ))}
                </ol>
            </div>
        );
    }
}

export default ScorersPage;
