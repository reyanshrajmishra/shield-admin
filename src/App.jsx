import React, { useState, useEffect } from "react";
import FeedsTab from "./FeedsTab.jsx";
import EmployeesTab from "./EmployeesTab.jsx";
import WantedsTab from "./WantedTab.jsx";  // <-- Import the real WantedTab component

const PASSWORD = "weareshield";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("feeds");

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setLoggedIn(true);
    }
  }, []);

  function handleLogin() {
    if (password === PASSWORD) {
      localStorage.setItem("loggedIn", "true");
      setLoggedIn(true);
    } else {
  // TODO: Handle incorrect password (removed alert)
    }
  }

  function handleLogout() {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
    setPassword("");
  }

  if (!loggedIn) {
    return (
      <div id="login-screen" style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          autoFocus
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div id="dashboard-screen" style={{ maxWidth: 900, margin: "auto", marginTop: 50 }}>
      <h1>SHIELD Admin Panel</h1>
      <nav style={{ marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("feeds")}
          style={{ marginRight: 10, fontWeight: activeTab === "feeds" ? "bold" : "normal" }}
        >
          Feeds
        </button>
        <button
          onClick={() => setActiveTab("wanteds")}
          style={{ marginRight: 10, fontWeight: activeTab === "wanteds" ? "bold" : "normal" }}
        >
          Wanteds
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          style={{ fontWeight: activeTab === "employees" ? "bold" : "normal" }}
        >
          Employees
        </button>
      </nav>
      <button onClick={handleLogout}>Logout</button>

      {activeTab === "feeds" && <FeedsTab />}
      {activeTab === "wanteds" && <WantedsTab />}
      {activeTab === "employees" && <EmployeesTab />}
    </div>
  );
}
