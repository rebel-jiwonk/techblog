"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("No active session. Please use the password reset link sent to your email.");
        router.push("/admin/login");
      }
    };

    init();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("Failed to reset password: " + error.message);
      setLoading(false);
      return;
    }

    alert("Password updated. You can now log in.");
    router.push("/admin/login");
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Reset Your Password</h1>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}