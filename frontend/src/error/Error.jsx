import { useLocation, useNavigate } from "react-router-dom"

const ErrorPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const message = location.state?.message || "Something went wrong."
  const detail = location.state?.detail

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-purple-100">
      <div className="bg-white/90 p-8 rounded-3xl shadow-xl border border-gray-200 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-4">{message}</p>
        {detail && (
          <pre className="text-xs text-gray-500 bg-gray-100 p-4 rounded-xl overflow-x-auto mb-4">
            {detail}
          </pre>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl transition"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition"
          >
            Go to Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
