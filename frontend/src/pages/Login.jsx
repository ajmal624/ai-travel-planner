import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function getErrorMessage(error, defaultMessage) {
    const data = error?.response?.data;

    if (!data) {
      return defaultMessage;
    }

    if (typeof data === "string") {
      return data;
    }

    if (data.detail) {
      return data.detail;
    }

    const messages = [];

    Object.entries(data).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        messages.push(`${field}: ${value.join(", ")}`);
      } else if (typeof value === "string") {
        messages.push(`${field}: ${value}`);
      }
    });

    if (messages.length > 0) {
      return messages.join(" ");
    }

    return defaultMessage;
  }

  async function submit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      /*
       * STEP 1:
       * Register the user if we are in registration mode.
       */
      if (registerMode) {
        await api.post("auth/register/", {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      }

      /*
       * STEP 2:
       * Get JWT access and refresh tokens.
       */
      const response = await api.post("auth/token/", {
        username: form.username.trim(),
        password: form.password,
      });

      /*
       * STEP 3:
       * Save tokens.
       */
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      /*
       * STEP 4:
       * Go to the dashboard/home page.
       */
      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);

      if (registerMode && error?.response?.status === 400) {
        setError(
          getErrorMessage(
            error,
            "Unable to create the account. Please check your details."
          )
        );
      } else if (error?.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (error?.response?.status === 404) {
        setError(
          "Authentication API was not found. Please check the backend URL and API routes."
        );
      } else if (error?.response?.status >= 500) {
        setError(
          "The server encountered an error. Please try again later."
        );
      } else {
        setError(
          getErrorMessage(
            error,
            "Unable to complete the request. Please try again."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setRegisterMode((previousMode) => !previousMode);
    setError("");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>TripGenius</h1>

        <p>
          {registerMode
            ? "Create an account"
            : "Welcome back"}
        </p>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <input
          required
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
        />

        {registerMode && (
          <input
            required
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        )}

        <input
          required
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete={
            registerMode
              ? "new-password"
              : "current-password"
          }
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : registerMode
              ? "Create account"
              : "Sign in"}
        </button>

        <button
          className="text-button"
          type="button"
          onClick={toggleMode}
          disabled={loading}
        >
          {registerMode
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}