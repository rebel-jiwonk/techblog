"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    // Supabase injects access_token via URL after user clicks email link
    supabase.auth.getUser().then((result) => {
  if (result.data?.user) {
    setCanReset(true);
  }
});
  }, []);

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("Reset failed: " + error.message);
    } else {
      alert("Password successfully updated!");
      router.push("/admin-login"); // or wherever you want
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>

      {canReset ? (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border p-2 mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-black text-white py-2"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-600">
          Invalid or expired reset link. Please check your email again.
        </p>
      )}
    </div>
  );
}