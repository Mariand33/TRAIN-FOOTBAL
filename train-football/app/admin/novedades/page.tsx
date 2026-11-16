
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../supabase";

type Novedad = {
  id: number;
  titulo: string;
  subtitulo: string;
  contenido: string;
  descripcion: string;
  imagen_url: string;
  media_url: string;
  media_tipo: string;
  publicada: boolean;
};

export default function NovedadesAdmin() {
  const [sesion, setSesion] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(!!data.session);
      setVerificando(false);
      if (data.session) cargar();
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSesion(!!session);
        if (session) cargar();
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function cargar() {
    const { data, error } = await supabase
      .from("novedades_train_football")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setMensaje("Error al cargar: " + error.message);
    else setNovedades((data || []) as Novedad[]);
  }

  async function publicar(e: FormEvent) {
    e.preventDefault();

    if (!titulo.trim() || !subtitulo.trim() || !contenido.trim()) {
      setMensaje("Completá título, subtítulo y contenido.");
      return;
    }

    setCargando(true);
    setMensaje("");

    let url = "";
    let tipo = "imagen";

    if (archivo) {
      tipo = archivo.type.startsWith("video/") ? "video" : "imagen";

      const nombre = `${Date.now()}-${archivo.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("novedades")
        .upload(nombre, archivo);

      if (uploadError) {
        setMensaje("Error al subir archivo: " + uploadError.message);
        setCargando(false);
        return;
      }

      url = supabase.storage.from("novedades").getPublicUrl(nombre).data.publicUrl;
    }

    const { error } = await supabase
      .from("novedades_train_football")
      .insert({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        contenido: contenido.trim(),
        descripcion: subtitulo.trim(),
        imagen_url: tipo === "imagen" ? url : "",
        media_url: url,
        media_tipo: tipo,
        publicada: true,
      });

    if (error) {
      setMensaje("Error al publicar: " + error.message);
    } else {
      setTitulo("");
      setSubtitulo("");
      setContenido("");
      setArchivo(null);
      setMensaje("¡Novedad publicada correctamente!");
      await cargar();
    }

    setCargando(false);
  }

  async function cambiarEstado(n: Novedad) {
    const { error } = await supabase
      .from("novedades_train_football")
      .update({ publicada: !n.publicada })
      .eq("id", n.id);

    if (error) setMensaje(error.message);
    else {
      setMensaje(n.publicada ? "Novedad despublicada." : "Novedad publicada.");
      await cargar();
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar definitivamente esta novedad?")) return;

    const { error } = await supabase
      .from("novedades_train_football")
      .delete()
      .eq("id", id);

    if (error) setMensaje(error.message);
    else {
      setMensaje("Publicación eliminada.");
      await cargar();
    }
  }

  if (verificando) {
    return <main style={{ padding: 30 }}>Verificando acceso...</main>;
  }

  if (!sesion) {
    return <main style={{ padding: 30 }}>Necesitás iniciar sesión para administrar las novedades.</main>;
  }

  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800 }}>ADMINISTRAR NOVEDADES</h1>
      <p>Noticias, actividades y contenidos de Train Football.</p>

      <form
        onSubmit={publicar}
        style={{
          display: "grid",
          gap: 14,
          marginTop: 25,
          padding: 22,
          border: "1px solid #ddd",
          borderRadius: 12,
        }}
      >
        <h2>Nueva publicación</h2>

        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título principal"
          style={{ padding: 13 }}
        />

        <input
          value={subtitulo}
          onChange={e => setSubtitulo(e.target.value)}
          placeholder="Subtítulo o bajada"
          style={{ padding: 13 }}
        />

        <textarea
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          placeholder="Contenido completo de la noticia"
          rows={8}
          style={{ padding: 13 }}
        />

        <label>Fotografía o video (opcional)</label>

        <input
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          onChange={e => setArchivo(e.target.files?.[0] || null)}
        />

        <button
          disabled={cargando}
          type="submit"
          style={{
            padding: 14,
            background: "#111827",
            color: "white",
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          {cargando ? "PUBLICANDO..." : "PUBLICAR NOVEDAD"}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h2 style={{ marginTop: 35 }}>Publicaciones ({novedades.length})</h2>

      <div style={{ display: "grid", gap: 14 }}>
        {novedades.map(n => (
          <article
            key={n.id}
            style={{ padding: 15, border: "1px solid #ddd", borderRadius: 10 }}
          >
            {n.media_tipo === "video" && n.media_url ? (
              <video src={n.media_url} controls style={{ maxWidth: 220 }} />
            ) : (n.media_url || n.imagen_url) ? (
              <img
                src={n.media_url || n.imagen_url}
                alt={n.titulo}
                style={{ width: 180, maxHeight: 120, objectFit: "cover" }}
              />
            ) : null}

            <h3>{n.titulo}</h3>
            <p>{n.subtitulo || n.descripcion}</p>
            <p>{n.publicada ? "Publicada" : "Despublicada"}</p>

            <button onClick={() => cambiarEstado(n)}>
              {n.publicada ? "Despublicar" : "Publicar"}
            </button>

            {" "}

            <button
              onClick={() => eliminar(n.id)}
              style={{ color: "red" }}
            >
              Eliminar
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
