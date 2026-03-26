import { useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isRegister, setIsRegister] = useState(false)

  if (!token) {
    return isRegister ? (
      <Register
        setToken={setToken}
        goToLogin={() => setIsRegister(false)}
      />
    ) : (
      <Login
        setToken={setToken}
        goToRegister={() => setIsRegister(true)}
      />
    )
  }

  return <Home token={token} />
}

export default App