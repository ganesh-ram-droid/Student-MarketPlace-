import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContextCore";
import { API_URL } from "../config/api";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }

      login(data.token, data.user);
      alert("Login Successful");
      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">
        <div className="bg-black text-white p-6 sm:p-10 md:p-14 flex flex-col justify-center">
          <p className="text-green-400 font-semibold uppercase tracking-wide mb-4">
            Student Marketplace
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Welcome Back To
            <span className="block text-green-400">Campus Marketplace</span>
          </h1>

          <p className="mt-6 text-gray-300 text-base sm:text-lg leading-relaxed">
            Buy and sell books, electronics, notes, hostel essentials and more
            with your campus community.
          </p>
        </div>

        <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-green-600 font-semibold hover:underline"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
