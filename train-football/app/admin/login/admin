
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Train Football
        </p>

        <h1 className="mb-2 text-3xl font-bold">
          Panel de administración
        </h1>

        <p className="mb-8 text-sm text-slate-400">
          Ingresá con tu usuario autorizado.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Correo electrónico</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Contraseña</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>
      </div>
    </main>
  );
}
