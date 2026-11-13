"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Material = {
  id: string;
  titulo: string;
  descripcion: string | null;
  curso: string;
  tipo: string;
  archivo_url: string | null;
  video_url: string | null;
};

export default function MaterialesPage() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      const { data, error } = await supabase
        .from("materiales")
        .select("id, titulo, descripcion, curso, tipo, archivo_url, video_url")
        .order("created_at", { ascending: false });

      if (error) {
        setError("No se pudo cargar la biblioteca. Verificá los permisos de lectura pública de Supabase.");
      } else {
        setMateriales((data ?? []) as Material[]);
      }
      setCargando(false);
    }

    cargar();
  }, []);

  const cursos = ["Todos", ...Array.from(new Set(materiales.map(m => m.curso).filter(Boolean)))];
  const visibles = materiales.filter(m =>
    (cursoSeleccionado === "Todos" || m.curso === cursoSeleccionado) &&
    (m.archivo_url || m.video_url)
  );

  return (
    <main className="min-h-screen bg-[#080d1b] text-white">
      <header className="border-b border-white/10 bg-[#080d1b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <img src="/images/02-logo-blanco-circular.png" alt="TRAIN Football" className="h-12 w-12 rounded-full" />
            <span className="font-black tracking-wide">TRAIN FOOTBALL</span>
          </a>
          <a href="/" className="text-sm font-bold text-amber-300 hover:text-amber-200">← Volver al inicio</a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-violet-400/20 bg-gradient-to-br from-[#17213b] via-[#10182a] to-[#080d1b] px-6 py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Biblioteca de formación</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">Materiales <span className="text-amber-300">de estudio.</span></h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            Libros, documentos, apuntes y recursos audiovisuales para acompañar tu formación como entrenador y profesional del fútbol.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Biblioteca TRAIN Football</h2>
            <p className="mt-2 text-sm text-gray-400">Recursos publicados por el equipo de formación.</p>
          </div>
          <select
            value={cursoSeleccionado}
            onChange={e => setCursoSeleccionado(e.target.value)}
            className="rounded-xl border border-white/15 bg-[#10182a] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
            aria-label="Filtrar materiales por curso"
          >
            {cursos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {cargando ? (
          <p className="py-12 text-center text-gray-400">Cargando biblioteca...</p>
        ) : error ? (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/5 p-6 text-amber-100">{error}</div>
        ) : visibles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#10182a] px-6 py-14 text-center">
            <p className="text-xl font-bold">Próximamente nuevos materiales</p>
            <p className="mt-3 text-gray-400">El equipo de TRAIN Football está preparando recursos para esta biblioteca.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibles.map(material => (
              <article key={material.id} className="flex flex-col rounded-2xl border border-violet-400/20 bg-[#10182a] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.10)]">
                <p className="text-xs font-black uppercase tracking-wider text-amber-300">{material.curso}</p>
                <h3 className="mt-4 text-xl font-black">{material.titulo}</h3>
                {material.descripcion && <p className="mt-3 flex-1 leading-7 text-gray-400">{material.descripcion}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  {material.archivo_url && (
                    <a href={material.archivo_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-[#080d1b] hover:bg-amber-200">
                      Abrir material ↗
                    </a>
                  )}
                  {material.video_url && (
                    <a href={material.video_url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-cyan-300/50 px-5 py-3 text-sm font-bold text-cyan-200 hover:bg-cyan-300/10">
                      Ver video ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        TRAIN Football · Formación, capacitación y metodología
      </footer>
    </main>
  );
}
