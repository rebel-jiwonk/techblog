"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const domain = email.split("@")[1];
    if (!domain || domain !== "rebellions.ai") {
      alert("Only @rebellions.ai emails are allowed.");
      setLoading(false);
      return;
    }

    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    console.log("auth result:", data, error);

    if (error) {
      alert(error.message);
    } else {
      // If sign-up, wait for confirmation (or skip if disabled)
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {isSignup ? "Sign Up" : "Login"}
      </h1>
      <form onSubmit={handleAuth} className="space-y-4">
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
          {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          className="underline"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}