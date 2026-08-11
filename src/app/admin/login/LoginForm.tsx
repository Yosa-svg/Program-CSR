"use client";

import { useState } from "react";
import { loginAction } from "@/actions/authActions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const res = await loginAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input 
          type="email" 
          name="email"
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="admin@csr.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input 
          type="password" 
          name="password"
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
