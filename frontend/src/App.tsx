import { Dashboard } from "./pages/Dashboard"
import { SharedBrain } from "./pages/SharedBrain";
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

function App() {
  const token = localStorage.getItem("token");
  console.log(token);
  
  return <BrowserRouter>
    <Routes>
      <Route 
        path="/"
        element = {token ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />}
      />

      <Route 
        path="/signup"
        element = {token ? <Navigate to="/dashboard" /> : <Signup />}
      />

      <Route 
        path="/signin"
        element = {token ? <Navigate to="/dashboard" /> : <Signin />}
      />

      <Route 
        path="/dashboard"
        element = {token ? <Dashboard /> : <Navigate to="/signup" />}
      />

      <Route 
        path="/share/:shareid"
        element = {token ? <SharedBrain /> : <Navigate to="/signup" />}
      />

      <Route path="*" element={<Navigate to="/" />}/>
    </Routes>
  </BrowserRouter>
}

export default App
