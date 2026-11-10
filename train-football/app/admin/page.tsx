"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabase";

const modulos = [
  {
    titulo: "Auspiciantes",
    descripcion: "Gestionar empresas, logos e información de patrocinadores.",
    destino: "/admin/sponsors",
    icono: "🏆",
    color: "#d97706",
  },
  {
    titulo: "Equipo y Staff",
    descripcion: "Administrar integrantes, fotografías y perfiles del equipo.",
    destino: "/admin/staff",
    icono: "👥",
    color: "#2563eb",
  },
  {
    titulo: "Animaciones",
    descripcion: "Crear categorías y subir videos, GIF e imágenes.",
    destino: "/admin/animaciones",
    icono: "🎬",
    color: "#9333ea",
  },
  {
    titulo: "Materiales de formación",
    descripcion: "Gestionar documentos, videos y contenidos de los cursos.",
    destino: "/admin/materiales",
    icono: "📚",
    color: "#059669",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    let active = true;

    async function verificarSesion() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      setEmail(data.session.user.email ?? "");
      setChecking(false);
    }

    verificarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session) {
        router.replace("/admin/login");
      } else {
        setEmail(session.user.email ?? "");
        setChecking(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function cerrarSesion() {
    setCerrando(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Verificando acceso...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
              TRAIN Football
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Centro de Administración
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Gestioná los contenidos y herramientas de la plataforma.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Sesión iniciada</p>
              <p className="text-sm font-semibold">{email}</p>
            </div>
            <button
              onClick={cerrarSesion}
              disabled={cerrando}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
            >
              {cerrando ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </div>
        </header>

        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold">Herramientas de gestión</h2>
            <p className="mt-1 text-sm text-slate-400">
              Seleccioná el módulo al que querés ingresar.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {modulos.map((modulo) => (
              <Link
                key={modulo.destino}
                href={modulo.destino}
                className="group rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-slate-800"
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                  style={{ backgroundColor: `${modulo.color}25` }}
                >
                  {modulo.icono}
                </div>

                <h3 className="text-xl font-bold group-hover:text-emerald-400">
                  {modulo.titulo}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                  {modulo.descripcion}
                </p>

                <p className="mt-5 text-sm font-bold text-emerald-400">
                  INGRESAR AL MÓDULO →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          TRAIN Football · Panel de administración
        </footer>
      </div>
    </main>
  );
}
