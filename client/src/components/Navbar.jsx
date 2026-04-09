import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/impact", label: "Impact" },
  { to: "/stories", label: "Stories" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" }
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand-mark" to="/">
          <span className="brand-mark__icon">R</span>
          <span>
            <strong>Rural Education</strong>
            <small>& Skill Development</small>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
            className="nav-cta"
            onClick={() => setOpen(false)}
          >
            {isAuthenticated ? "Dashboard" : "Admin"}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
