import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="logo">AgroAI 🌾</div>

      <ul className="nav-links">
        <li className={isActive("/")}>
          <Link to="/">Home</Link>
        </li>

        <li className={isActive("/prediction")}>
          <Link to="/prediction">Prediction</Link>
        </li>

        <li className={isActive("/technology")}>
          <Link to="/technology">Technology</Link>
        </li>

        <li className={isActive("/results")}>
          <Link to="/results">Results</Link>
        </li>

        <li className={isActive("/about")}>
          <Link to="/about">About</Link>
        </li>

        <li className={isActive("/contact")}>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}