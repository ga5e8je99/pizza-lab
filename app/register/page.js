"use client";
import { useState } from "react";
import Link from "next/link";
import RegisterIcon from "@/public/loginIcon.svg";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-neutral-900">
      <div className="relative flex items-center justify-center w-full max-w-4xl py-25 animate-fadeIn">

        <div
          className="relative w-full h-screen max-w-lg p-12 pt-16 border shadow-2xl bg-neutral-800/70 backdrop-blur-xl rounded-3xl border-neutral-700"
        >
             <div className="absolute -top-20 flex justify-center w-full z-20 left-[50%] -translate-x-[50%]">
          <div className="p-6 border rounded-full shadow-xl bg-neutral-800/70 backdrop-blur-lg border-neutral-700 animate-float">
            <Image src={RegisterIcon} alt="register icon" className="w-20 h-20" />
          </div>
        </div>
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-center text-yellow-400 drop-shadow-md">
            Create Account
          </h1>

          <p className="mt-2 text-center text-neutral-400">
            Join us and start your journey
          </p>

          {/* Form */}
          <form className="mt-10 space-y-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-neutral-300">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 text-white transition-all border outline-none rounded-xl bg-neutral-700/70 border-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-neutral-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 text-white transition-all border outline-none rounded-xl bg-neutral-700/70 border-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition -translate-y-1/2 top-1/2 right-4 text-neutral-300 hover:text-yellow-400"
                >
                  {showPassword ? (<Eye className="text-yellow-400"/>) : (<EyeOff/>)}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-neutral-300">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full p-3 text-white transition-all border outline-none rounded-xl bg-neutral-700/70 border-neutral-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 font-bold text-black transition-all duration-300 bg-yellow-500 shadow-lg hover:bg-yellow-400 rounded-xl hover:shadow-yellow-500/50 active:scale-95"
            >
              Register
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-neutral-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-yellow-400 transition hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
