import { Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  const handleSetToken = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <Routes>

      {/* Public routes */}
      <Route
        path="/login"
        element={<Login setToken={handleSetToken} />}
      />

      <Route
        path="/register"
        element={<Register setToken={handleSetToken} />}
      />

      {/* Protected route */}
      <Route
        path="/home"
        element={
          token ? (
            <Home token={token} logout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={<Navigate to={token ? "/home" : "/login"} />}
      />

    </Routes>
  )
}

export default App