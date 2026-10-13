import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VALID_EMAIL = "mkkhan1974@gmail.com";
const VALID_PASSWORD = "1974";

export const AUTH_KEY = "dadi_logged_in";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      navigate("/dadi", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-semibold">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Enter password"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
