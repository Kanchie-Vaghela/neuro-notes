import { useState } from "react"
import { apiRequest } from "../utils/api"

export default function Login({ setToken, goToRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password) return alert("Fill all fields")

    const data = await apiRequest("/auth/login", "POST", {
      email,
      password
    })

    if (data.token) {
      localStorage.setItem("token", data.token)
      setToken(data.token)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-2xl mb-4 text-center">Login</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-4 rounded bg-gray-700"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
        >
          Login
        </button>

        <p
          onClick={goToRegister}
          className="text-sm text-center mt-4 cursor-pointer text-gray-400 hover:text-white"
        >
          Don’t have an account? Register
        </p>
      </div>
    </div>
  )
}