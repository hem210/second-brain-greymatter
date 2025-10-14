import { Dashboard } from "./pages/Dashboard"
import { SharedBrain } from "./pages/SharedBrain";
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Sync state with localStorage changes (like login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />}
        />
        <Route 
          path="/signup"
          element={token ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route 
          path="/signin"
          element={token ? <Navigate to="/dashboard" /> : <Signin setToken={setToken} />}
        />
        <Route 
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/signup" />}
        />
        <Route 
          path="/share/:shareid"
          element={token ? <SharedBrain /> : <Navigate to="/signup" />}
        />
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
