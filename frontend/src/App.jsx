import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useState } from "react"
import TitleManager from "./components/modes/TitleManager"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import ErrorPage from "./error/Error"

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => sessionStorage.getItem("token"))

  const handleSetToken = (newToken) => {
    if (newToken) {
      sessionStorage.setItem("token", newToken)
    }
    setToken(newToken)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    setToken(null)
    navigate("/login")
  }

  return (
    <>
      <TitleManager />
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

      <Route path="/error" element={<ErrorPage />} />

      {/* Default redirect */}
      <Route
        path="*"
        element={<Navigate to={token ? "/home" : "/login"} />}
      />

    </Routes>
    </>
  )
}

export default App