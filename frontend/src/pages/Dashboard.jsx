import "../styles/dashboard.css";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setSweets);
  }, []);

  return (
    <div className="dashboard">
      <header>
        <h2>Dashboard</h2>
        <button onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}>Logout</button>
      </header>

      <div className="grid">
        {sweets.map(s => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.category}</p>
            <p>₹{s.price}</p>
            <p>Qty: {s.quantity}</p>

            <button disabled={s.quantity === 0}>Purchase</button>

            {role === "admin" && <button className="danger">Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
