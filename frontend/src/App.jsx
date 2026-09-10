import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import CreateTrip from "./pages/CreateTrip";
import Dashboard from "./pages/Dashboard";
import Itinerary from "./pages/Itinerary";
import Login from "./pages/Login";
import TripDetails from "./pages/TripDetails";

function ProtectedRoute({ children }) {
  return localStorage.getItem("access_token")
    ? children
    : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="create-trip" element={<CreateTrip />} />
        <Route path="trips/:id" element={<TripDetails />} />
        <Route path="trips/:id/itinerary" element={<Itinerary />} />
      </Route>
    </Routes>
  );
}