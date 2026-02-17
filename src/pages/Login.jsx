import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, login } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("intern@demo.com"); // prefill for demo
  const [password, setPassword] = useState("intern123"); // prefill for demo
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in, go to board
    if (isLoggedIn()) navigate("/", { replace: true });
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    const result = login({ email: email.trim(), password, remember });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Login</h2>

        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="intern@demo.com"
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <label style={{ display: "block", marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="intern123"
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>

        {error ? (
          <div style={{ background: "#ffe8e8", padding: 10, borderRadius: 8, marginBottom: 12 }}>
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>

        <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Demo credentials: intern@demo.com / intern123
        </p>
      </form>
    </div>
  );
}