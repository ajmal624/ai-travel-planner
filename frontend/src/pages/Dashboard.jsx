<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("dashboard/").then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data) {
    return <p>Loading your trips...</p>;
  }

  return (
    <section>
      <div className="page-heading row-between">
        <div>
          <h1>My Travel Plans</h1>
          <p>Create personalized travel itineraries in seconds.</p>
        </div>

        <Link className="button-link" to="/create-trip">
          + Plan a trip
        </Link>
      </div>

      <div className="stats-grid">
        <article className="stat-card purple">
          <span>Total trips</span>
          <strong>{data.total_trips}</strong>
        </article>

        <article className="stat-card blue">
          <span>Activities planned</span>
          <strong>{data.total_activities}</strong>
        </article>

        <article className="stat-card green">
          <span>Activities completed</span>
          <strong>{data.completed_activities}</strong>
        </article>
      </div>

      <div className="trip-grid">
        {data.upcoming_trips.length === 0 ? (
          <article className="card">
            <h2>No trips yet</h2>
            <p>Create your first AI travel plan.</p>
          </article>
        ) : (
          data.upcoming_trips.map((trip) => (
            <article className="card trip-card" key={trip.id}>
              <h2>{trip.title}</h2>
              <p>
                {trip.city}
                {trip.country ? `, ${trip.country}` : ""}
              </p>
              <p>
                {trip.start_date} to {trip.end_date}
              </p>
              <p>{trip.trip_days} day trip · {trip.pace} pace</p>

              <Link className="button-link" to={`/trips/${trip.id}`}>
                View trip
              </Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
=======
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("dashboard/").then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data) {
    return <p>Loading your trips...</p>;
  }

  return (
    <section>
      <div className="page-heading row-between">
        <div>
          <h1>My Travel Plans</h1>
          <p>Create personalized travel itineraries in seconds.</p>
        </div>

        <Link className="button-link" to="/create-trip">
          + Plan a trip
        </Link>
      </div>

      <div className="stats-grid">
        <article className="stat-card purple">
          <span>Total trips</span>
          <strong>{data.total_trips}</strong>
        </article>

        <article className="stat-card blue">
          <span>Activities planned</span>
          <strong>{data.total_activities}</strong>
        </article>

        <article className="stat-card green">
          <span>Activities completed</span>
          <strong>{data.completed_activities}</strong>
        </article>
      </div>

      <div className="trip-grid">
        {data.upcoming_trips.length === 0 ? (
          <article className="card">
            <h2>No trips yet</h2>
            <p>Create your first AI travel plan.</p>
          </article>
        ) : (
          data.upcoming_trips.map((trip) => (
            <article className="card trip-card" key={trip.id}>
              <h2>{trip.title}</h2>
              <p>
                {trip.city}
                {trip.country ? `, ${trip.country}` : ""}
              </p>
              <p>
                {trip.start_date} to {trip.end_date}
              </p>
              <p>{trip.trip_days} day trip · {trip.pace} pace</p>

              <Link className="button-link" to={`/trips/${trip.id}`}>
                View trip
              </Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
>>>>>>> 044613901e135b56f5d40479de9d89927dc76f0a
}