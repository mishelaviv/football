import React, { Component } from "react";
import LeagueSelector from "../components/LeagueSelector";
import { getTeams, getHistory, getSquad, getTeamHist } from "../api";

class TablesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leagueId: "",
            table: [],
            extra: null
        };

        this.handleLeagueSelect = this.handleLeagueSelect.bind(this);
        this.rowClick = this.rowClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.leagueId !== this.state.leagueId && this.state.leagueId) {
            Promise.all([getTeams(this.state.leagueId), getHistory(this.state.leagueId)])
                .then(([teamsRes, histRes]) => {
                    const games = histRes.data;
                    const stats = {};

                    function ensure(teamObj) {
                        const { id, name } = teamObj;
                        if (!stats[id]) stats[id] = { id, name, pts: 0, gf: 0, ga: 0 };
                        return stats[id];
                    }

                    games.forEach((g) => {
                        const home = ensure(g.homeTeam);
                        const away = ensure(g.awayTeam);
                        const hGoals = g.goals.filter((go) => go.home).length;
                        const aGoals = g.goals.length - hGoals;

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

                    const final = Object.values(stats)
                        .map((t) => ({ ...t, gd: t.gf - t.ga }))
                        .sort(
                            (a, b) =>
                                b.pts - a.pts ||
                                b.gd - a.gd ||
                                a.name.localeCompare(b.name)
                        );

                    this.setState({ table: final, extra: null });
                });
        }
    }

    handleLeagueSelect(leagueId) {
        this.setState({ leagueId });
    }

    rowClick(team) {
        const { leagueId } = this.state;
        Promise.all([getSquad(leagueId, team.id), getTeamHist(leagueId, team.id)])
            .then(([sqRes, histRes]) => {
                this.setState({
                    extra: {
                        team,
                        squad: sqRes.data,
                        hist: histRes.data
                    }
                });
            });
    }

    render() {
        const { table, extra } = this.state;

        return (
            <div className="container">
                <h2 className="mb-3">League Table</h2>
                <LeagueSelector onSelect={this.handleLeagueSelect} />

                {table.length > 0 && (
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
                        {table.map((t, i) => {
                            const color =
                                i === 0
                                    ? "#0d6efd"
                                    : i >= table.length - 3
                                        ? "#dc3545"
                                        : "inherit";
                            const bold = i === 0 ? 600 : 400;

                            return (
                                <tr
                                    key={t.id}
                                    onClick={() => this.rowClick(t)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ color, fontWeight: bold }}>{i + 1}</td>
                                    <td style={{ color, fontWeight: bold }}>{t.name}</td>
                                    <td style={{ color }}>{t.pts}</td>
                                    <td style={{ color }}>{t.gd}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}

                {extra && (
                    <div className="card mt-4">
                        <div className="card-body">
                            <h4>{extra.team.name} – Squad</h4>
                            <ul className="list-group mb-3">
                                {extra.squad.map((p) => (
                                    <li key={p.id} className="list-group-item">
                                        {p.firstName} {p.lastName}
                                        {p.captain && " (C)"}
                                    </li>
                                ))}
                            </ul>

                            <h4>Match history</h4>
                            <ul className="list-group">
                                {extra.hist.map((m) => {
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
