"use client";

import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
  setLoading(true);
  try {
    const response = await fetch("/api/admin-reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Password updated. Please log in.");
      router.push("/admin/login");
    } else {
      alert("Reset failed: " + result.error);
    }
  } catch (err) {
    alert("Unexpected error: " + err);
  } finally {
    setLoading(false);
  }
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