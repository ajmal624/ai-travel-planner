<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState("");

  async function loadTrip() {
    const response = await api.get(`trips/${id}/`);
    setTrip(response.data);
  }

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function generateItinerary() {
    setMessage("Creating your personalized itinerary...");

    try {
      const response = await api.post(`trips/${id}/generate-itinerary/`);
      setMessage(
        `Itinerary created. Estimated activity cost: ₹${Number(
          response.data.estimated_budget
        ).toLocaleString("en-IN")}`
      );
      loadTrip();
    } catch {
      setMessage("Could not create the itinerary.");
    }
  }

  async function deleteTrip() {
    if (!window.confirm("Delete this trip and its itinerary?")) return;

    await api.delete(`trips/${id}/`);
    navigate("/");
  }

  if (!trip) {
    return <p>Loading trip...</p>;
  }

  return (
    <section>
      <div className="page-heading row-between">
        <div>
          <h1>{trip.title}</h1>
          <p>
            {trip.city}
            {trip.country ? `, ${trip.country}` : ""}
          </p>
        </div>

        <button className="danger-button" onClick={deleteTrip}>
          Delete trip
        </button>
      </div>

      <div className="details-grid">
        <article className="card">
          <h2>Trip details</h2>
          <p><strong>Dates:</strong> {trip.start_date} to {trip.end_date}</p>
          <p><strong>Duration:</strong> {trip.trip_days} days</p>
          <p><strong>Travelers:</strong> {trip.travelers}</p>
          <p><strong>Budget:</strong> {trip.budget}</p>
          <p><strong>Pace:</strong> {trip.pace}</p>
          <p><strong>Interests:</strong> {trip.interests}</p>
        </article>

        <article className="card">
          <h2>Estimated plan cost</h2>
          <strong className="big-price">
            ₹{Number(trip.estimated_budget).toLocaleString("en-IN")}
          </strong>
          <p>Estimated for activities in the generated itinerary.</p>
        </article>
      </div>

      <div className="card">
        <h2>AI itinerary generator</h2>
        <p>
          The planner uses your budget, pace, dates, city, and interests to
          create daily activities.
        </p>

        <button onClick={generateItinerary}>
          Generate personalized itinerary
        </button>

        {message && <p className="message success">{message}</p>}

        {Number(trip.total_estimated_cost) > 0 && (
          <Link className="button-link" to={`/trips/${trip.id}/itinerary`}>
            Open itinerary
          </Link>
        )}
      </div>
    </section>
  );
=======
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState("");

  async function loadTrip() {
    const response = await api.get(`trips/${id}/`);
    setTrip(response.data);
  }

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function generateItinerary() {
    setMessage("Creating your personalized itinerary...");

    try {
      const response = await api.post(`trips/${id}/generate-itinerary/`);
      setMessage(
        `Itinerary created. Estimated activity cost: ₹${Number(
          response.data.estimated_budget
        ).toLocaleString("en-IN")}`
      );
      loadTrip();
    } catch {
      setMessage("Could not create the itinerary.");
    }
  }

  async function deleteTrip() {
    if (!window.confirm("Delete this trip and its itinerary?")) return;

    await api.delete(`trips/${id}/`);
    navigate("/");
  }

  if (!trip) {
    return <p>Loading trip...</p>;
  }

  return (
    <section>
      <div className="page-heading row-between">
        <div>
          <h1>{trip.title}</h1>
          <p>
            {trip.city}
            {trip.country ? `, ${trip.country}` : ""}
          </p>
        </div>

        <button className="danger-button" onClick={deleteTrip}>
          Delete trip
        </button>
      </div>

      <div className="details-grid">
        <article className="card">
          <h2>Trip details</h2>
          <p><strong>Dates:</strong> {trip.start_date} to {trip.end_date}</p>
          <p><strong>Duration:</strong> {trip.trip_days} days</p>
          <p><strong>Travelers:</strong> {trip.travelers}</p>
          <p><strong>Budget:</strong> {trip.budget}</p>
          <p><strong>Pace:</strong> {trip.pace}</p>
          <p><strong>Interests:</strong> {trip.interests}</p>
        </article>

        <article className="card">
          <h2>Estimated plan cost</h2>
          <strong className="big-price">
            ₹{Number(trip.estimated_budget).toLocaleString("en-IN")}
          </strong>
          <p>Estimated for activities in the generated itinerary.</p>
        </article>
      </div>

      <div className="card">
        <h2>AI itinerary generator</h2>
        <p>
          The planner uses your budget, pace, dates, city, and interests to
          create daily activities.
        </p>

        <button onClick={generateItinerary}>
          Generate personalized itinerary
        </button>

        {message && <p className="message success">{message}</p>}

        {Number(trip.total_estimated_cost) > 0 && (
          <Link className="button-link" to={`/trips/${trip.id}/itinerary`}>
            Open itinerary
          </Link>
        )}
      </div>
    </section>
  );
>>>>>>> 044613901e135b56f5d40479de9d89927dc76f0a
}