"use client";
import { useState } from "react";
import Link from "next/link";
import LoginIcon from "@/public/loginIcon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (data.success && data.token) {
        setSuccess(true);
        localStorage.setItem("auth_token_pizza", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Dispatch storage event for Navbar update
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-neutral-950 py-16">
      <div className="relative flex items-center justify-center w-full max-w-lg animate-fadeIn">
        {/* Card */}
        <div className="w-full p-8 sm:p-12 border shadow-2xl bg-neutral-900/90 backdrop-blur-xl rounded-3xl border-neutral-800">
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 border rounded-2xl shadow-xl bg-neutral-800/80 border-neutral-700">
              <LogIn className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Sign in to access your PizzaHouse account
          </p>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mt-6 text-sm text-red-400 border rounded-xl bg-red-500/10 border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 mt-6 text-sm text-emerald-400 border rounded-xl bg-emerald-500/10 border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Login successful! Redirecting...</span>
            </div>
          )}

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-300">Email Address</label>
              <input
                type="email"
                required
                value={loginData.email}
                placeholder="name@example.com"
                className="w-full p-3.5 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-neutral-300">Password</label>
                <Link href="#" className="text-xs text-yellow-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  placeholder="Enter your password"
                  className="w-full p-3.5 pr-11 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute -translate-y-1/2 top-1/2 right-3.5 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <Eye className="w-4 h-4 text-yellow-500" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 font-bold text-neutral-950 transition-all bg-yellow-500 hover:bg-yellow-400 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="p-3 mt-6 border rounded-xl bg-neutral-950/60 border-neutral-800 text-xs text-neutral-400 space-y-1">
            <span className="font-semibold text-neutral-300 block">Demo Account:</span>
            <div className="flex justify-between font-mono text-[11px]">
              <span>Email: gamal@example.com</span>
              <span>Pass: password123</span>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-yellow-500 transition hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
