import { useState } from "react";
import Login from "./Login_tmp";
import Dashboard from "./Dashboard";
import Forbidden from "./Forbidden";

function App() {
  const [user, setUser] = useState(null);

  // =========================
  // BELUM LOGIN
  // =========================
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // =========================
  // VALIDASI ROLE (AMAN)
  // =========================
  const roles = user.roles || [];

  const isValidRole =
    roles.includes("Admin") ||
    roles.includes("Editor") ||
    roles.includes("Viewer");

  // =========================
  // ROLE TIDAK VALID → 403
  // =========================
  if (!isValidRole) {
    return <Forbidden />;
  }

  // =========================
  // DASHBOARD
  // =========================
  return <Dashboard user={user} />;
}

export default App;
