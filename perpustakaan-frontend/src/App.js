import { useState } from "react";
import Login from "./Login_tmp";
import Dashboard from "./Dashboard";
import Forbidden from "./Forbidden";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  // ROLE TIDAK VALID → 403
  if (
    !user.roles.includes("Admin") &&
    !user.roles.includes("Editor") &&
    !user.roles.includes("Viewer")
  ) {
    return <Forbidden />;
  }

  return <Dashboard user={user} />;
}

export default App;
