import { useState } from "react"
import { apiRequest } from "../utils/api"

export default function Register({ setToken, goToLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    if (!email || !password) return alert("Fill all fields")

    const data = await apiRequest("/auth/register", "POST", {
      email,
      password
    })

    if (data.message === "User registered successfully") {
      const loginData = await apiRequest("/auth/login", "POST", {
        email,
        password
      })

      localStorage.setItem("token", loginData.token)
      setToken(loginData.token)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-2xl mb-4 text-center">Register</h2>

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
          onClick={handleRegister}
          className="w-full bg-green-500 hover:bg-green-600 p-2 rounded"
        >
          Register
        </button>

        <p
          onClick={goToLogin}
          className="text-sm text-center mt-4 cursor-pointer text-gray-400 hover:text-white"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  )
}