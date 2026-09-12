import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api";

export default function Itinerary() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);

  async function loadData() {
    const [tripResponse, itemResponse] = await Promise.all([
      api.get(`trips/${id}/`),
      api.get(`itinerary/?trip=${id}`),
    ]);

    setTrip(tripResponse.data);
    setItems(itemResponse.data);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function toggleCompleted(item) {
    await api.patch(`itinerary/${item.id}/`, {
      completed: !item.completed,
    });

    loadData();
  }

  if (!trip) {
    return <p>Loading itinerary...</p>;
  }

  const groupedItems = {};

  items.forEach((item) => {
    if (!groupedItems[item.date]) {
      groupedItems[item.date] = [];
    }

    groupedItems[item.date].push(item);
  });

  return (
    <section>
      <div className="page-heading">
        <h1>{trip.title} itinerary</h1>
        <p>
          {trip.city} · {trip.start_date} to {trip.end_date}
        </p>
      </div>

      <div className="card">
        <h2>Total estimated activity cost</h2>
        <strong className="big-price">
          ₹{Number(trip.total_estimated_cost).toLocaleString("en-IN")}
        </strong>
      </div>

      {Object.entries(groupedItems).map(([date, dayItems]) => (
        <article className="card itinerary-day" key={date}>
          <h2>{date}</h2>

          <div className="itinerary-list">
            {dayItems.map((item) => (
              <div
                className={`itinerary-item ${item.completed ? "completed" : ""}`}
                key={item.id}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleCompleted(item)}
                />

                <div>
                  <span className="time-badge">{item.time_slot}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <small>
                    {item.category} · Estimated ₹
                    {Number(item.estimated_cost).toLocaleString("en-IN")}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}