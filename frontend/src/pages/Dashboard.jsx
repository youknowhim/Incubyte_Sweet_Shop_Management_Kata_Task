import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);

  const loadSweets = async () => {
    const res = await fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSweets(await res.json());
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const purchaseSweet = async (id) => {
    await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadSweets();
  };

  const deleteSweet = async (id) => {
    await fetch(`http://localhost:5000/api/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadSweets();
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Dashboard</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>

      <div className="grid">
        {sweets.map((s) => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.category}</p>
            <p>₹{s.price}</p>
            <p>Qty: {s.quantity}</p>

            {/* Purchase → user + admin */}
            <button
              disabled={s.quantity === 0}
              onClick={() => purchaseSweet(s.id)}
            >
              {s.quantity === 0 ? "Out of Stock" : "Purchase"}
            </button>

            {/* Admin-only actions */}
            {role === "admin" && (
              <>
                <button
                  className="danger"
                  onClick={() => deleteSweet(s.id)}
                >
                  Delete
                </button>

                <button onClick={() => navigate(`/restock/${s.id}`)}>
                  Restock
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
