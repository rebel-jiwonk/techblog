"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword, // this is just to get a session, not a real login
    });

    if (!signInError && data.user) {
      alert("You are already logged in. Go to the dashboard instead.");
      router.push("/admin/dashboard");
      return;
    }

    // Use Supabase Admin API to update user password (not available from client SDK by default)
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("Reset failed: " + error.message);
    } else {
      alert("Password updated. Please log in.");
      router.push("/admin/login");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Reset Admin Password</h1>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Your Admin Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-black text-white py-2"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}