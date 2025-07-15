import {useState, useEffect, useSyncExternalStore} from "react";
import LeagueSelector from "../components/LeagueSelector";
import { getHistory } from "../api";

function ScorersPage() {
  const [leagueId, setLeagueId] = useState("");
  const [leaders,  setLeaders]  = useState([]);

  /* every time the league changes, rebuild the table */
  useEffect(() => {
    if (!leagueId) return;
    getHistory(leagueId).then(r => {
      /* count goals per player */
      const tally = {};
      r.data.forEach(match =>
        match.goals.forEach(g => {
          const name = `${g.scorer.firstName} ${g.scorer.lastName}`;
          tally[name] = (tally[name] || 0) + 1;
        })
      );
      /* top 3 */
      const top3 = Object.entries(tally)
        .map(([name, goals]) => ({ name, goals }))
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 3);
      setLeaders(top3);
    });
  }, [leagueId]);

  return (
    <div className="container">
      <h2 className="mb-3">Top 3 Scorers</h2>
      <LeagueSelector onSelect={setLeagueId} />

      <ol className="list-group list-group-numbered mt-3">
        {leaders.map(p => (
          <li key={p.name} className="list-group-item d-flex justify-content-between">
            {p.name}
            <span className="badge bg-primary rounded-pill">{p.goals}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default ScorersPage;
