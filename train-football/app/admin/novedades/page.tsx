"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Novedad = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  publicada: boolean;
  created_at: string;
};

export default function NovedadesAdmin() {
  const [sesion, setSesion] = useState(false);
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(!!data.session);
      if (data.session) cargarNovedades();
    });
  }, []);

  async function cargarNovedades() {
    const { data, error } = await supabase
      .from("novedades_train_football")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMensaje("No se pudieron cargar las novedades: " + error.message);
      return;
    }

    setNovedades(data || []);
  }

  async function publicar(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim() || !foto) {
      setMensaje("Completá el título, la descripción y la fotografía.");
      return;
    }

    setCargando(true);
    setMensaje("");

    const extension = foto.name.split(".").pop() || "jpg";
    const nombre = `${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("novedades")
      .upload(nombre, foto, { upsert: true });

    if (uploadError) {
      setMensaje("Error al subir la foto: " + uploadError.message);
      setCargando(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("novedades")
      .getPublicUrl(nombre);

    const { error } = await supabase
      .from("novedades_train_football")
      .insert({
        titulo,
        descripcion,
        imagen_url: urlData.publicUrl,
        publicada: true,
      });

    if (error) {
      setMensaje("Error al guardar: " + error.message);
    } else {
      setTitulo("");
      setDescripcion("");
      setFoto(null);
      setMensaje("¡Novedad publicada correctamente!");
      cargarNovedades();
    }

    setCargando(false);
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar esta publicación?")) return;

    const { error } = await supabase
      .from("novedades_train_football")
      .delete()
      .eq("id", id);

    if (error) setMensaje(error.message);
    else {
      setMensaje("Publicación eliminada.");
      cargarNovedades();
    }
  }

  if (!sesion) {
    return <main style={{ padding: 40 }}>Verificando acceso al panel...</main>;
  }

  return (
    <main style={{ maxWidth: 850, margin: "auto", padding: 24 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800 }}>NOVEDADES</h1>
      <p>Administrá las noticias y actividades de Train Football.</p>

      <form onSubmit={publicar} style={{
        display: "grid", gap: 14, marginTop: 25,
        padding: 22, border: "1px solid #ddd", borderRadius: 12
      }}>
        <h2 style={{ fontSize: 21, fontWeight: 700 }}>Nueva publicación</h2>

        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título de la novedad"
          style={{ padding: 13, border: "1px solid #ccc", borderRadius: 8 }}
        />

        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Escribí la descripción..."
          rows={5}
          style={{ padding: 13, border: "1px solid #ccc", borderRadius: 8 }}
        />

        <label>Fotografía de la publicación</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFoto(e.target.files?.[0] || null)}
        />

        <button
          disabled={cargando}
          type="submit"
          style={{
            padding: 14, background: "#111827", color: "white",
            borderRadius: 8, fontWeight: 700
          }}
        >
          {cargando ? "Publicando..." : "PUBLICAR NOVEDAD"}
        </button>
      </form>

      {mensaje && <p style={{ marginTop: 18 }}>{mensaje}</p>}

      <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 35 }}>
        Publicaciones existentes
      </h2>

      <div style={{ display: "grid", gap: 16, marginTop: 15 }}>
        {novedades.map(n => (
          <article key={n.id} style={{
            display: "flex", gap: 15, padding: 14,
            border: "1px solid #ddd", borderRadius: 10
          }}>
            <img src={n.imagen_url} alt={n.titulo}
              style={{ width: 110, height: 90, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <strong>{n.titulo}</strong>
              <p>{n.descripcion}</p>
              <button onClick={() => eliminar(n.id)}
                style={{ color: "red" }}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
