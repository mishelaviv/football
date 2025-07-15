import { useState, useEffect } from "react";
import LeagueSelector from "../components/LeagueSelector";
import { getHistory } from "../api";

function HistoryPage() {
  const [leagueId,setLeagueId] = useState("");
  const [games,   setGames]    = useState([]);
  const [minR,    setMinR]     = useState("");
  const [maxR,    setMaxR]     = useState("");

  useEffect(() => {
    if (!leagueId) return;
    getHistory(leagueId).then(r => setGames(r.data));
  }, [leagueId]);

  const shown = games.filter(g =>
    (minR==="" || g.round >= +minR) &&
    (maxR==="" || g.round <= +maxR)
  );

  return (
    <div className="container">
      <h2 className="mb-3">Match History</h2>
      <LeagueSelector onSelect={setLeagueId} />

      {games.length > 0 && (
        <>
          <div className="my-3">
            Round&nbsp;
            <input type="number" className="form-control d-inline-block"
                   style={{width:90}} value={minR}
                   onChange={e=>setMinR(e.target.value)} />
            &nbsp;to&nbsp;
            <input type="number" className="form-control d-inline-block"
                   style={{width:90}} value={maxR}
                   onChange={e=>setMaxR(e.target.value)} />
          </div>

          <ul className="list-group">
            {shown.map(m => {
              const h = m.goals.filter(g=>g.home).length;
              const a = m.goals.length - h;
              return (
                <li key={m.id} className="list-group-item">
                  {m.homeTeam.name} {h} – {a} {m.awayTeam.name}
                  <span className="badge bg-secondary float-end">R{m.round}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
export default HistoryPage;