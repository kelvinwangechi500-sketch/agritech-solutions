"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ── DEMO LOGIN (replace with Supabase Auth in production) ──
    await new Promise(r => setTimeout(r, 800));
    if (email === "admin@agritechmarketplace.co.ke" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }

    // ── PRODUCTION: use Supabase Auth ──
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) setError(error.message);
    // else router.push("/admin/dashboard");

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">🌾</div>
          <h1 className="font-display font-bold text-2xl text-white">AgriTech Admin</h1>
          <p className="text-brand-200 text-sm mt-1">Sign in to manage the marketplace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="admin@agritechmarketplace.co.ke" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>Email: admin@agritechmarketplace.co.ke</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
