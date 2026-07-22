"use client";
import { useState } from "react";
import Link from "next/link";
import LoginIcon from "@/public/loginIcon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState();
  const router = useRouter();
  const handelSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setTimeout(() => {
      try {
        const mockResponse = {
          token: "mock_jwt_token_" + Math.random().toString(36).substr(2, 9),
          user: {
            id: "mock_user_" + Math.random().toString(36).substr(2, 9),
            name: loginData.email.split("@")[0],
            email: loginData.email,
          },
        };

        // Success
        setSuccess(true);

        localStorage.setItem("auth_token_pizza", mockResponse.token);
        localStorage.setItem("user", JSON.stringify(mockResponse.user));

        // Reset form
        setLoginData({ email: "", password: "" });

        // Show success message for 3 seconds, then redirect
      } catch (err) {
        setError("Login failed. Please try again.");
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-neutral-900">
      <div className="relative flex items-center justify-center w-full max-w-4xl py-20 animate-fadeIn ">
        {/* Icon */}
        <div className="absolute top-0 z-20 flex justify-center w-full">
          <div className="p-6 border rounded-full shadow-xl bg-neutral-800/70 backdrop-blur-lg border-neutral-700">
            <Image src={LoginIcon} alt="login" className="w-20 h-20" />
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg p-12 border shadow-2xl bg-neutral-800/70 backdrop-blur-xl rounded-3xl border-neutral-700 ">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-center text-yellow-400 drop-shadow-md">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-neutral-400">
            Login to continue to your account
          </p>

          {/* Form */}
          <form className="mt-10 space-y-6" onSubmit={handelSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-neutral-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 text-white transition-all border outline-none rounded-xl bg-neutral-700/70 border-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-neutral-300">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-3 text-white transition-all border outline-none rounded-xl bg-neutral-700/70 border-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition -translate-y-1/2 top-1/2 right-4 text-neutral-300 hover:text-yellow-400"
                >
                  {showPassword ? (
                    <Eye className="text-yellow-400" />
                  ) : (
                    <EyeOff />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href={'/'}
                className="text-sm text-yellow-400 transition hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-all duration-200 bg-linear-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  Login...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-yellow-400 transition hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* animations */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.7s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1;  }
          }
        `}
      </style>
    </div>
  );
}
