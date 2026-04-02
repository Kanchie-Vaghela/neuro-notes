import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../utils/api"

const Register = ({ setToken }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Fill all fields")
      return
    }

    try {
      setLoading(true)

      // 🔥 Register
      const data = await apiRequest("/auth/register", "POST", {
        email,
        password
      })

      if (data.message === "User registered successfully") {
        // 🔥 Auto login after register
        const loginData = await apiRequest("/auth/login", "POST", {
          email,
          password
        })

        if (loginData.token) {
          localStorage.setItem("token", loginData.token)
          setToken(loginData.token)

          // ✅ redirect
          navigate("/home")
        }
      } else {
        alert("Registration failed")
      }

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl w-80 shadow-sm border border-gray-200">

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Create Account ✨
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
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* Login redirect */}
        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-4 cursor-pointer text-gray-500 hover:text-gray-800"
        >
          Already have an account? Login
        </p>

      </div>
    </div>
  )
}

export default Register