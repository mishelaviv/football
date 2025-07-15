import { NavLink, Routes, Route } from "react-router-dom";
import TablesPage  from "./pages/TablesPage";
import HistoryPage from "./pages/HistoryPage";
import ScorersPage from "./pages/ScorersPage";
import StatsPage   from "./pages/StatsPage";
import NotFound    from "./pages/NotFound";

export default function App() {
  return (
    <>
      {/* prettier navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
            Leagues Data
          </NavLink>

          <button
            className="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navLinks">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="navLinks" className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {[
                { to: "/",        label: "Table",   end: true },
                { to: "/history", label: "History" },
                { to: "/scorers", label: "Scorers" },
                { to: "/stats",   label: "Stats" }
              ].map(({ to, label, end }) => (
                <li key={to} className="nav-item">
                  <NavLink
                    to={to} end={end}
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active fw-semibold" : "")
                    }>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* routes */}
      <Routes>
        <Route path="/"         element={<TablesPage />} />
        <Route path="/history"  element={<HistoryPage />} />
        <Route path="/scorers"  element={<ScorersPage />} />
        <Route path="/stats"    element={<StatsPage />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </>
  );
}
