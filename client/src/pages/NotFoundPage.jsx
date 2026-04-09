import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="admin-login-shell">
    <div className="admin-login-card">
      <p className="eyebrow">404</p>
      <h1>The page you asked for is not part of this rural education and skill development platform yet.</h1>
      <Link className="button button--primary" to="/">
        Return home
      </Link>
    </div>
  </div>
);
