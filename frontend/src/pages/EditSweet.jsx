import "../styles/form.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditSweet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

  // Load existing sweet
  useEffect(() => {
    fetch("/api/sweets", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const sweet = data.find(s => s.id === Number(id));
        if (sweet) setForm(sweet);
      });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    await fetch(`/api/sweets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity)
      })
    });

    navigate("/dashboard");
  };

  return (
    <div className="form-wrapper">
      <form className="form-card" onSubmit={submit}>
        <h2>Edit Sweet</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
        />

        <button>Update Sweet</button>
      </form>
    </div>
  );
}
