import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [sweets, setSweets] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Load all sweets
  const loadSweets = async () => {
    const res = await fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSweets(await res.json());
  };

  useEffect(() => {
    loadSweets();
  }, []);

  // Google-like search
  const searchSweets = async () => {
    if (!searchText.trim()) {
      loadSweets();
      return;
    }

    const params = new URLSearchParams();
    params.append("name", searchText);
    params.append("category", searchText);

    const res = await fetch(
      `http://localhost:5000/api/sweets/search?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setSweets(await res.json());
  };

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

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <h2>Sweet Shop Dashboard</h2>

        <div className="header-actions">
          <button onClick={() => navigate("/add")}>
            Add Sweet
          </button>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* SEARCH BAR (INLINE, GOOGLE-LIKE) */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search sweets by name or category..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={searchSweets}>
          Search
        </button>
      </div>

      {/* SWEETS GRID */}
      <div className="grid">
        {sweets.map((s) => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.category}</p>
            <p>₹{s.price}</p>
            <p>Qty: {s.quantity}</p>

            <button
              disabled={s.quantity === 0}
              onClick={() => purchaseSweet(s.id)}
            >
              {s.quantity === 0 ? "Out of Stock" : "Purchase"}
            </button>

            {/* Edit → user + admin */}
            <button onClick={() => navigate(`/edit/${s.id}`)}>
              Edit
            </button>

            {/* Admin only */}
            {role === "admin" && (
              <>
                <button onClick={() => navigate(`/restock/${s.id}`)}>
                  Restock
                </button>

                <button
                  className="danger"
                  onClick={() => deleteSweet(s.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
