import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Register = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // validation logic
  const validate = () => {
    let newErrors = {};

    // email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Min 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Must include uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Must include a number";
    }

    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const data = await apiRequest("/auth/register", "POST", {
        email,
        password,
      });

      if (data.message === "User registered successfully") {
        const loginData = await apiRequest("/auth/login", "POST", {
          email,
          password,
        });

        if (loginData.token) {
          setToken(loginData.token);
          navigate("/home");
        }
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl w-80 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Create Account 
        </h2>

        {/* Email */}
        <div className="mb-3">
          <input
            className={`w-full p-2 rounded-lg bg-gray-100 outline-none border 
              ${errors.email && touched.email ? "border-red-500" : "border-transparent"}`}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched({ ...touched, email: true })}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            className={`w-full p-2 rounded-lg bg-gray-100 outline-none border 
              ${errors.password && touched.password ? "border-red-500" : "border-transparent"}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched({ ...touched, password: true })}
          />
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

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
  );
};

export default Register;
