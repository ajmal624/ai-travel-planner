import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

export default function CreateTrip() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    budget: "medium",
    pace: "balanced",
    interests: "",
    travelers: 1,
  });

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("trips/", form);
      navigate(`/trips/${response.data.id}`);
    } catch {
      setError("Could not create the trip. Check the dates and try again.");
    }
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Plan a trip</h1>
        <p>Tell the planner what type of journey you want.</p>
      </div>

      <form className="card form-grid" onSubmit={submit}>
        {error && <div className="message error">{error}</div>}

        <input
          required
          placeholder="Trip title, e.g. Dubai Holiday"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />

        <input
          required
          placeholder="City, e.g. Dubai"
          value={form.city}
          onChange={(event) => setForm({ ...form, city: event.target.value })}
        />

        <input
          placeholder="Country, e.g. UAE"
          value={form.country}
          onChange={(event) =>
            setForm({ ...form, country: event.target.value })
          }
        />

        <label>
          Start date
          <input
            required
            type="date"
            value={form.start_date}
            onChange={(event) =>
              setForm({ ...form, start_date: event.target.value })
            }
          />
        </label>

        <label>
          End date
          <input
            required
            type="date"
            value={form.end_date}
            onChange={(event) =>
              setForm({ ...form, end_date: event.target.value })
            }
          />
        </label>

        <label>
          Number of travelers
          <input
            required
            min="1"
            type="number"
            value={form.travelers}
            onChange={(event) =>
              setForm({ ...form, travelers: event.target.value })
            }
          />
        </label>

        <label>
          Budget
          <select
            value={form.budget}
            onChange={(event) =>
              setForm({ ...form, budget: event.target.value })
            }
          >
            <option value="low">Budget</option>
            <option value="medium">Moderate</option>
            <option value="high">Luxury</option>
          </select>
        </label>

        <label>
          Preferred pace
          <select
            value={form.pace}
            onChange={(event) => setForm({ ...form, pace: event.target.value })}
          >
            <option value="slow">Slow and relaxed</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast-paced</option>
          </select>
        </label>

        <input
          required
          placeholder="Interests: food, history, nature, shopping, art, adventure"
          value={form.interests}
          onChange={(event) =>
            setForm({ ...form, interests: event.target.value })
          }
        />

        <button type="submit">Create travel plan</button>
      </form>
    </section>
  );
}