import { useState } from "react";
import Login from "./Login_tmp"; // pakai yang stabil
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login setUser={setUser} />;

  // Hanya Admin & Editor boleh ke dashboard
  if (!user.roles.includes("Admin") && !user.roles.includes("Editor") && !user.roles.includes("Viewer")) {
    return <h2>403 Forbidden</h2>;
  }

  return <Dashboard user={user} />;
}

export default App;
