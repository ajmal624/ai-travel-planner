import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CreateTrip() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    budget: "moderate",
    pace: "balanced",
    interests: "",
    travelers: 1,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: name === "travelers" ? Number(value) : value,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const tripData = {
        title: form.title.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        start_date: form.start_date,
        end_date: form.end_date,

        // IMPORTANT:
        // These values must match Django's BUDGET_CHOICES.
        budget: form.budget,

        pace: form.pace,

        // Backend currently stores interests as a comma-separated string.
        interests: form.interests.trim(),

        travelers: Number(form.travelers),
      };

      const response = await api.post("trips/", tripData);

      navigate(`/trips/${response.data.id}`);
    } catch (err) {
      console.error("Create trip error:", err);

      // Show the actual backend error when available.
      if (err.response?.data) {
        const backendError = err.response.data;

        if (typeof backendError === "string") {
          setError(backendError);
        } else {
          setError(JSON.stringify(backendError));
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Could not create the trip. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Plan a trip</h1>
        <p>Tell the planner what type of journey you want.</p>
      </div>

      <form className="card form-grid" onSubmit={submit}>
        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {/* Trip title */}
        <input
          required
          name="title"
          placeholder="Trip title, e.g. Dubai Holiday"
          value={form.title}
          onChange={handleChange}
        />

        {/* City */}
        <input
          required
          name="city"
          placeholder="City, e.g. Dubai"
          value={form.city}
          onChange={handleChange}
        />

        {/* Country */}
        <input
          name="country"
          placeholder="Country, e.g. UAE"
          value={form.country}
          onChange={handleChange}
        />

        {/* Start date */}
        <label>
          Start date
          <input
            required
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
          />
        </label>

        {/* End date */}
        <label>
          End date
          <input
            required
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
          />
        </label>

        {/* Travelers */}
        <label>
          Number of travelers
          <input
            required
            min="1"
            name="travelers"
            type="number"
            value={form.travelers}
            onChange={handleChange}
          />
        </label>

        {/* Budget */}
        <label>
          Budget
          <select
            name="budget"
            value={form.budget}
            onChange={handleChange}
          >
            <option value="budget">Budget</option>
            <option value="moderate">Moderate</option>
            <option value="luxary">Luxury</option>
          </select>
        </label>

        {/* Pace */}
        <label>
          Preferred pace
          <select
            name="pace"
            value={form.pace}
            onChange={handleChange}
          >
            <option value="slow">Slow and relaxed</option>
            <option value="balanced">Balanced</option>
            <option value="fast">Fast-paced</option>
          </select>
        </label>

        {/* Interests */}
        <input
          required
          name="interests"
          placeholder="Interests: food, history, nature, shopping, art, adventure"
          value={form.interests}
          onChange={handleChange}
        />

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating travel plan..." : "Create travel plan"}
        </button>
      </form>
    </section>
  );
}