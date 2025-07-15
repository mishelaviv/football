import { useState, useEffect } from "react";
import LeagueSelector from "../components/LeagueSelector";
import { getHistory } from "../api";

function StatsPage() {
  const [leagueId,setLeagueId] = useState("");
  const [stats,   setStats]    = useState(null);

  useEffect(() => {
    if (!leagueId) return;
    getHistory(leagueId).then(r => calc(r.data));
  }, [leagueId]);

  function calc(games) {
    let firstHalf=0, secondHalf=0, earliest=120, latest=0;
    const goalsPerRound = {};

    games.forEach(m => {
      const round = m.round;
      const total = m.goals.length;
      goalsPerRound[round] = (goalsPerRound[round]||0) + total;

      m.goals.forEach(g => {
        const min = g.minute;
        if (min <= 45) firstHalf++; else secondHalf++;
        if (min <  earliest) earliest = min;
        if (min >  latest)   latest   = min;
      });
    });

    const entries = Object.entries(goalsPerRound);
    const [mostR]  = entries.reduce((a,b)=> b[1]>a[1]?b:a);
    const [leastR] = entries.reduce((a,b)=> b[1]<a[1]?b:a);

    setStats({ firstHalf, secondHalf, earliest, latest, mostR, leastR });
  }

  return (
    <div className="container">
      <h2 className="mb-3">League Statistics</h2>
      <LeagueSelector onSelect={setLeagueId} />

      {stats && (
        <ul className="list-group mt-3">
          <li className="list-group-item">
            Goals 1st half: <strong>{stats.firstHalf}</strong>
          </li>
          <li className="list-group-item">
            Goals 2nd half: <strong>{stats.secondHalf}</strong>
          </li>
          <li className="list-group-item">
            Earliest goal minute: <strong>{stats.earliest}'</strong>
          </li>
          <li className="list-group-item">
            Latest goal minute: <strong>{stats.latest}'</strong>
          </li>
          <li className="list-group-item">
            Round with most goals: <strong>{stats.mostR}</strong>
          </li>
          <li className="list-group-item">
            Round with fewest goals: <strong>{stats.leastR}</strong>
          </li>
        </ul>
      )}
    </div>
  );
}
export default StatsPage;
