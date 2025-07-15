import { useEffect, useState } from "react";
import { getLeagues } from "../api";

function LeagueSelector({ onSelect }) {
  const [leagues, setLeagues] = useState([]);
  const [chosen,  setChosen]  = useState("");

  useEffect(() => { getLeagues().then(r => setLeagues(r.data)); }, []);

  function handle(e) {
    setChosen(e.target.value);
    onSelect(e.target.value);
  }

  return (
    <select value={chosen} onChange={handle}>
      <option value="">-- choose league --</option>
      {leagues.map(l => (
        <option key={l.id} value={l.id}>{l.name}</option>
      ))}
    </select>
  );
}
export default LeagueSelector;