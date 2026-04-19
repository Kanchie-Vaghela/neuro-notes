import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../utils/api"

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields")
      return
    }

    try {
      setLoading(true)

      const data = await apiRequest("/auth/login", "POST", {
        email,
        password
      })

      if (data.token) {
        setToken(data.token)

        // 🔥 redirect after login
        navigate("/home")
      } else {
        alert("Invalid credentials")
      }

    } catch (err) {
      console.error(err)
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl w-80 shadow-sm border border-gray-200">

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Welcome Back ✨
        </h2>

        {/* Email */}
        <input
          className="w-full p-2 mb-3 rounded-lg bg-gray-100 text-gray-700 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full p-2 mb-4 rounded-lg bg-gray-100 text-gray-700 outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register redirect */}
        <p
          onClick={() => navigate("/register")}
          className="text-sm text-center mt-4 cursor-pointer text-gray-500 hover:text-gray-800"
        >
          Don’t have an account? Register
        </p>

      </div>
    </div>
  )
}

export default Login