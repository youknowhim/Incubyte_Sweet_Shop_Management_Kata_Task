import "../styles/form.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RestockSweet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!amount) {
      alert("Amount required");
      return;
    }

    await fetch(`http://localhost:5000/api/sweets/${id}/restock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount: Number(amount) })
    });

    navigate("/dashboard");
  };

  return (
    <div className="form-wrapper">
      <form className="form-card" onSubmit={submit}>
        <h2>Restock Sweet</h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button>Restock</button>
      </form>
    </div>
  );
}
