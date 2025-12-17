import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      setUser(data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to continue to TaskFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">{error}</div>}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              name="email"
              placeholder="you@example.com"
              type="email"
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              placeholder="••••••••"
              type="password"
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              required
            />
          </div>

          <button disabled={false} className="btn-primary w-full py-3 text-lg shadow-xl shadow-indigo-500/20 mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
