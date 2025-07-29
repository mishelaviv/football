import { NavLink, Routes, Route } from "react-router-dom";
import TablesPage from "./pages/TablesPage";
import HistoryPage from "./pages/HistoryPage";
import ScorersPage from "./pages/ScorersPage";
import StatsPage from "./pages/StatsPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <NavLink className="navbar-brand fw-bold" to="/">
              Leagues Data
            </NavLink>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" end>
                    Table
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/history" className="nav-link">
                    History
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/scorers" className="nav-link">
                    Scorers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/stats" className="nav-link">
                    Stats
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<TablesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/scorers" element={<ScorersPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
  );
}
