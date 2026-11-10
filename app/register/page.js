"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        setSuccess(true);
        localStorage.setItem("auth_token_pizza", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || "Registration failed. Please try again.");
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
              <UserPlus className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-white">
            Create Account
          </h1>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Join PizzaHouse to order faster and track deliveries
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
              <span>Account created successfully! Redirecting...</span>
            </div>
          )}

          {/* Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                placeholder="e.g. John Doe"
                className="w-full p-3 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-300">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                placeholder="name@example.com"
                className="w-full p-3 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-300">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                placeholder="+20 100 000 0000"
                className="w-full p-3 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-300">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  placeholder="At least 6 characters"
                  className="w-full p-3 pr-11 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-300">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                placeholder="Re-enter your password"
                className="w-full p-3 text-sm text-white transition-all border outline-none rounded-xl bg-neutral-950 border-neutral-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 font-bold text-neutral-950 transition-all bg-yellow-500 hover:bg-yellow-400 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-xs text-center text-neutral-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-yellow-500 transition hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
