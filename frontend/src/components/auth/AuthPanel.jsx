import { useState } from "react";

export default function AuthPanel() {
  const [email, setEmail] = useState("admin@keyboard-manager.local");
  const [password, setPassword] = useState("keyboard123");
  const [result, setResult] = useState(null);

  async function callAuth(type) {
    const res = await fetch(`http://localhost:4000/api/auth/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const json = await res.json();
    setResult(json);

    if (json.token) {
      localStorage.setItem("keyboard_manager_token", json.token);
    }
  }

  async function checkMe() {
    const token = localStorage.getItem("keyboard_manager_token") || "";
    const res = await fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setResult(await res.json());
  }

  return (
    <div className="auth-panel">
      <h2>User Account + Cloud Sync</h2>

      <div className="auth-grid">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />

        <button onClick={() => callAuth("register")}>Create Account</button>
        <button onClick={() => callAuth("login")}>Login</button>
        <button onClick={checkMe}>Check Session</button>
      </div>

      {result && (
        <pre className="auth-result">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
