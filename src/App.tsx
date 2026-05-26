import "./App.css";

import { useState, useEffect } from "react";

interface ClientForm {
  name: string;
  phone: string;
  address: string;
}

interface Client {
  _id: string;
  name: string;
  phone: string;
  address: string;
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<ClientForm>({
    name: "",
    phone: "",
    address: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    fetch("api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add client");
      setForm({ name: "", phone: "", address: "" });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <>
      <section id="">
        <div>
          <h1>Casas Client Manager</h1>
          <h2>homepage</h2>
        </div>
      </section>

      <div className="ticks">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Saving..." : "Add Client"}
          </button>
          {status === "success" && <p>Client added!</p>}
          {status === "error" && <p>Something went wrong. Try again.</p>}
        </form>
      </div>

      <div className="spacer flex justify-center">
        <h3> All clients list here</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.address}</td>
                <td>{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
