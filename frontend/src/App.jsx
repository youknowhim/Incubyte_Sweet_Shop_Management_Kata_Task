import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddSweet from "./pages/AddSweet";
import EditSweet from "./pages/EditSweet";
import RestockSweet from "./pages/RestockSweet";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* User as well as Admin */}
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddSweet />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditSweet />
            </PrivateRoute>
          }
        />


        {/* Admin only */}
        <Route
          path="/restock/:id"
          element={
            <AdminRoute>
              <RestockSweet />
            </AdminRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
