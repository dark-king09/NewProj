import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { siteApi } from "../services/api";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nextPath = location.state?.from || "/admin/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await siteApi.loginAdmin({ email, password });
      login(data.token, data.user);
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <p className="eyebrow">Admin access</p>
        <h1>Sign in to manage content, uploads, and incoming partner messages.</h1>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button button--primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Open dashboard"}
          </button>
        </form>
        <Link to="/" className="admin-login-back">
          Back to website
        </Link>
      </div>
    </div>
  );
};
