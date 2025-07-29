import React, { Component } from "react";
import LeagueSelector from "../components/LeagueSelector";
import { getHistory } from "../api";

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
            getHistory(this.state.leagueId).then((res) => {
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
