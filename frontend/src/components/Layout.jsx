import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>TripGenius</h1>
        <p>Personalized travel planning</p>

        <nav>
          <NavLink to="/">My Trips</NavLink>
          <NavLink to="/create-trip">Plan a Trip</NavLink>
        </nav>

        <button className="logout-button" onClick={logout}>
          Log out
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}