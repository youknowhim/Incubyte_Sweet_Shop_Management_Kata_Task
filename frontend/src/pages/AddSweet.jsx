import "../styles/form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSweet() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    // basic frontend validation
    if (
      !form.name ||
      !form.category ||
      !form.price ||
      !form.quantity
    ) {
      alert("All fields are required");
      return;
    }

    await fetch("/api/sweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity)
      })
    });

    navigate("/dashboard");
  };

  return (
    <div className="form-wrapper">
      <form className="form-card" onSubmit={submit}>
        <h2>Add Sweet</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <button>Add Sweet</button>
      </form>
    </div>
  );
}
