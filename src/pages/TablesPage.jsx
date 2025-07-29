import React, { Component } from "react";
import axios from "axios";
import LeagueSelector from "../components/LeagueSelector";

class TablesPage extends Component {
    state = {
        leagueId: "",
        table: [],
        extra: null,
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
                    const stats = {};

                    const ensure = (team) => {
                        const { id, name } = team;
                        if (!stats[id]) stats[id] = { id, name, pts: 0, gf: 0, ga: 0 };
                        return stats[id];
                    };

                    response.data.forEach((match) => {
                        const home = ensure(match.homeTeam);
                        const away = ensure(match.awayTeam);
                        const hGoals = match.goals.filter((g) => g.home).length;
                        const aGoals = match.goals.length - hGoals;

                        home.gf += hGoals;
                        home.ga += aGoals;
                        away.gf += aGoals;
                        away.ga += hGoals;

                        if (hGoals > aGoals) home.pts += 3;
                        else if (hGoals < aGoals) away.pts += 3;
                        else {
                            home.pts++;
                            away.pts++;
                        }
                    });

                    const finalTable = Object.values(stats)
                        .map((team) => ({ ...team, gd: team.gf - team.ga }))
                        .sort(
                            (a, b) =>
                                b.pts - a.pts ||
                                b.gd - a.gd ||
                                a.name.localeCompare(b.name)
                        );

                    this.setState({ table: finalTable, extra: null, loadedLeague: this.state.leagueId });
                })
                .catch((error) => {
                    console.error("Error loading history:", error);
                });
        }
    }

    handleLeagueSelect = (leagueId) => {
        this.setState({ leagueId });
    };

    rowClick = (team) => {
        axios
            .get(`https://app.seker.live/fm1/squad/${this.state.leagueId}/${team.id}`)
            .then((squadRes) => {
                const squad = squadRes.data;

                axios
                    .get(`https://app.seker.live/fm1/history/${this.state.leagueId}/${team.id}`)
                    .then((historyRes) => {
                        this.setState({
                            extra: {
                                team,
                                squad,
                                hist: historyRes.data
                            }
                        });
                    })
                    .catch((err) => console.error("Team history error:", err));
            })
            .catch((err) => console.error("Squad error:", err));
    };

    render() {
        return (
            <div className="container">
                <h2 className="mb-3">League Table</h2>
                <LeagueSelector onSelect={this.handleLeagueSelect} />

                {this.state.table.length > 0 && (
                    <table className="table table-striped table-bordered mt-3">
                        <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th>Pts</th>
                            <th>GD</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.table.map((team, index) => {
                            const color =
                                index === 0
                                    ? "#0d6efd"
                                    : index >= this.state.table.length - 3
                                        ? "#dc3545"
                                        : "inherit";
                            const fontWeight = index === 0 ? 600 : 400;

                            return (
                                <tr
                                    key={team.id}
                                    onClick={() => this.rowClick(team)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ color, fontWeight }}>{index + 1}</td>
                                    <td style={{ color, fontWeight }}>{team.name}</td>
                                    <td style={{ color }}>{team.pts}</td>
                                    <td style={{ color }}>{team.gd}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}

                {this.state.extra && (
                    <div className="card mt-4">
                        <div className="card-body">
                            <h4>{this.state.extra.team.name} – Squad</h4>
                            <ul className="list-group mb-3">
                                {this.state.extra.squad.map((p) => (
                                    <li key={p.id} className="list-group-item">
                                        {p.firstName} {p.lastName}
                                        {p.captain && " (C)"}
                                    </li>
                                ))}
                            </ul>

                            <h4>Match history</h4>
                            <ul className="list-group">
                                {this.state.extra.hist.map((m) => {
                                    const hGoals = m.goals.filter((g) => g.home).length;
                                    const aGoals = m.goals.length - hGoals;
                                    return (
                                        <li key={m.id} className="list-group-item">
                                            {m.homeTeam.name} {hGoals} &ndash; {aGoals} {m.awayTeam.name}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default TablesPage;
