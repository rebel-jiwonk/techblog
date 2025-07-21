"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      router.push("/admin");
    }

    setLoading(false);
  };

  // const handleSignUp = async () => {
  //   const newEmail = window.prompt("Enter new admin email:");
  //   if (!newEmail) return;

  //   const newPassword = window.prompt("Enter a password for this admin:");
  //   if (!newPassword) return;

  //   const { data, error } = await supabase.auth.signUp({
  //     email: newEmail,
  //     password: newPassword,
  //   });

  //   if (error) {
  //     alert("Sign-up failed: " + error.message);
  //   } else {
  //     alert(`Admin account created for ${newEmail}. Please log in.`);
  //   }
  // };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="text-center mt-4 space-y-2">
        {/* <button
          onClick={() => router.push("/admin/reset-password")}
          className="text-sm text-blue-600 underline block"
        >
          Forgot Password?
        </button> */}
        <button
          onClick={() => router.push("/reset-password")}
          className="text-sm text-green-600 underline block"
        >
          Change Password
        </button>
        {/* <button
          onClick={handleSignUp}
          className="text-sm text-purple-600 underline block"
        >
          Sign Up
        </button> */}
      </div>
    </div>
  );
}