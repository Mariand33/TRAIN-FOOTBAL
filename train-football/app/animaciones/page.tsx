"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabase";

type Categoria = {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
};

type Animacion = {
  id: string;
  categoria_id: string | null;
  titulo: string;
  descripcion: string | null;
  tipo: string | null;
  media_url: string | null;
  miniatura_url: string | null;
  orden: number;
};

export default function AnimacionesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [animaciones, setAnimaciones] = useState<Animacion[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarContenido() {
      const [catRes, animRes] = await Promise.all([
        supabase
          .from("animacion_categorias")
          .select("id,nombre,descripcion,orden")
          .eq("activo", true)
          .order("orden"),
        supabase
          .from("animaciones")
          .select("*")
          .eq("activo", true)
          .order("orden"),
      ]);

      if (catRes.error) setError(catRes.error.message);
      else setCategorias(catRes.data || []);

      if (animRes.error) setError(animRes.error.message);
      else setAnimaciones(animRes.data || []);

      setCargando(false);
    }

    cargarContenido();
  }, []);

  const contenidos = categoriaActiva
    ? animaciones.filter((item) => item.categoria_id === categoriaActiva.id)
    : [];

  return (
    <main className="min-h-screen bg-[#07111f] px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">
          ← Volver a TRAIN Football
        </Link>

        <header className="py-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
            TRAIN FOOTBALL
          </p>

          <h1 className="text-4xl font-black md:text-6xl">
            ANIMACIONES
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Biblioteca de ejercicios, recursos visuales y contenidos para
            la formación y el entrenamiento del fútbol.
          </p>
        </header>

        {cargando ? (
          <p className="py-16 text-center text-gray-400">
            Cargando contenidos...
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-200">
            No pudimos cargar los contenidos: {error}
          </div>
        ) : !categoriaActiva ? (
          <>
            <div className="mb-7">
              <h2 className="text-2xl font-bold">Explorar subgrupos</h2>
              <p className="mt-2 text-gray-400">
                Seleccioná un área para ingresar a sus ejercicios y recursos.
              </p>
            </div>

            {categorias.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                <h2 className="text-xl font-bold">Estamos preparando esta biblioteca</h2>
                <p className="mt-2 text-gray-400">
                  Próximamente encontrarás aquí los diferentes subgrupos.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categorias.map((categoria) => {
                  const cantidad = animaciones.filter(
                    (item) => item.categoria_id === categoria.id
                  ).length;

                  return (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaActiva(categoria)}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:-translate-y-1 hover:border-amber-400/70 hover:bg-white/10"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-2xl text-amber-400">
                        ⚽
                      </div>

                      <h3 className="text-xl font-bold transition group-hover:text-amber-300">
                        {categoria.nombre}
                      </h3>

                      {categoria.descripcion && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                          {categoria.descripcion}
                        </p>
                      )}

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {cantidad} contenidos
                        </span>
                        <span className="font-bold text-amber-400">
                          Ingresar →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setCategoriaActiva(null)}
              className="mb-7 rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-amber-400 hover:text-amber-300"
            >
              ← Volver a todos los subgrupos
            </button>

            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-amber-400">
                ANIMACIONES / SUBGRUPO
              </p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                {categoriaActiva.nombre}
              </h2>
              {categoriaActiva.descripcion && (
                <p className="mt-3 text-gray-300">
                  {categoriaActiva.descripcion}
                </p>
              )}
            </div>

            {contenidos.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                <h3 className="text-xl font-bold">Próximamente</h3>
                <p className="mt-2 text-gray-400">
                  Todavía no hay ejercicios cargados en este subgrupo.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {contenidos.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    {item.miniatura_url && (
                      <img
                        src={item.miniatura_url}
                        alt={item.titulo}
                        className="h-52 w-full object-cover"
                      />
                    )}

                    <div className="p-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        {item.tipo || "Contenido"}
                      </p>

                      <h3 className="text-xl font-bold">{item.titulo}</h3>

                      {item.descripcion && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-300">
                          {item.descripcion}
                        </p>
                      )}

                      {item.media_url && (
                        <a
                          href={item.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-block rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-black hover:bg-amber-300"
                        >
                          Ver contenido →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
