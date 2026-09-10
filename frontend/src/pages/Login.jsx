import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      if (registerMode) {
        await api.post("auth/register/", form);
      }

      const response = await api.post("auth/token/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      navigate("/");
    } catch {
      setError("Unable to sign in. Check your username and password.");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>TripGenius</h1>
        <p>{registerMode ? "Create an account" : "Welcome back"}</p>

        {error && <div className="message error">{error}</div>}

        <input
          required
          placeholder="Username"
          value={form.username}
          onChange={(event) =>
            setForm({ ...form, username: event.target.value })
          }
        />

        {registerMode && (
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        )}

        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />

        <button type="submit">
          {registerMode ? "Create account" : "Sign in"}
        </button>

        <button
          className="text-button"
          type="button"
          onClick={() => setRegisterMode(!registerMode)}
        >
          {registerMode
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}