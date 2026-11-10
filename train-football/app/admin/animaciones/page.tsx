"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../supabase";

type Categoria = {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
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
  activo: boolean;
};

const campo = "w-full rounded-lg border border-gray-300 p-3 text-gray-900";
const boton = "rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-600";

export default function AdminAnimacionesPage() {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [animaciones, setAnimaciones] = useState<Animacion[]>([]);

  const [categoriaEditando, setCategoriaEditando] = useState<string | null>(null);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [ordenCategoria, setOrdenCategoria] = useState("0");

  const [animacionEditando, setAnimacionEditando] = useState<string | null>(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [archivoMedia, setArchivoMedia] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [miniaturaUrl, setMiniaturaUrl] = useState("");
  const [orden, setOrden] = useState("0");
  const [activo, setActivo] = useState(true);

  async function cargarDatos() {
    const [catRes, animRes] = await Promise.all([
      supabase.from("animacion_categorias").select("*").order("orden"),
      supabase.from("animaciones").select("*").order("orden"),
    ]);

    if (catRes.error) setMensaje("Error al cargar categorías: " + catRes.error.message);
    else setCategorias(catRes.data || []);

    if (animRes.error) setMensaje("Error al cargar animaciones: " + animRes.error.message);
    else setAnimaciones(animRes.data || []);
  }

  useEffect(() => {
    let activo = true;

    async function verificarSesion() {
      const { data, error } = await supabase.auth.getSession();

      if (!activo) return;

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      setEmail(data.session.user.email || "");
      await cargarDatos();

      if (activo) setCargando(false);
    }

    verificarSesion();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/admin/login");
      }
    );

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function limpiarCategoria() {
    setCategoriaEditando(null);
    setNombreCategoria("");
    setDescripcionCategoria("");
    setOrdenCategoria("0");
  }

  async function guardarCategoria(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");

    const datos = {
      nombre: nombreCategoria.trim(),
      descripcion: descripcionCategoria.trim() || null,
      orden: Number(ordenCategoria) || 0,
    };

    const resultado = categoriaEditando
      ? await supabase.from("animacion_categorias").update(datos).eq("id", categoriaEditando)
      : await supabase.from("animacion_categorias").insert(datos);

    if (resultado.error) {
      setMensaje("No se pudo guardar la categoría: " + resultado.error.message);
      return;
    }

    setMensaje("Categoría guardada correctamente.");
    limpiarCategoria();
    await cargarDatos();
  }

  function editarCategoria(cat: Categoria) {
    setCategoriaEditando(cat.id);
    setNombreCategoria(cat.nombre);
    setDescripcionCategoria(cat.descripcion || "");
    setOrdenCategoria(String(cat.orden ?? 0));
  }

  async function eliminarCategoria(id: string) {
    if (!confirm("¿Eliminar esta categoría y sus animaciones asociadas?")) return;

    const { error } = await supabase.from("animacion_categorias").delete().eq("id", id);

    if (error) setMensaje("No se pudo eliminar: " + error.message);
    else {
      setMensaje("Categoría eliminada.");
      await cargarDatos();
    }
  }

  function limpiarAnimacion() {
    setAnimacionEditando(null);
    setCategoriaId("");
    setTitulo("");
    setDescripcion("");
    setTipo("video");
    setMediaUrl("");
    setArchivoMedia(null);
    setMiniaturaUrl("");
    setOrden("0");
    setActivo(true);
  }

  async function guardarAnimacion(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setSubiendo(true);

    try {
      let urlFinal = mediaUrl.trim() || null;
      let tipoFinal = tipo;

      if (archivoMedia) {
        const tiposPermitidos = [
          "image/jpeg", "image/png", "image/webp", "image/gif",
          "video/mp4", "video/webm", "video/quicktime"
        ];

        if (!tiposPermitidos.includes(archivoMedia.type)) {
          setMensaje("Formato no permitido. Seleccioná JPG, PNG, WEBP, GIF, MP4, WEBM o MOV.");
          return;
        }

        if (archivoMedia.size > 100 * 1024 * 1024) {
          setMensaje("El archivo supera el límite de 100 MB.");
          return;
        }

        const nombreSeguro = archivoMedia.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "-");

        const ruta = `${Date.now()}-${nombreSeguro}`;

        const { error: errorSubida } = await supabase.storage
          .from("animaciones")
          .upload(ruta, archivoMedia, {
            contentType: archivoMedia.type,
            upsert: false
          });

        if (errorSubida) {
          setMensaje("No se pudo subir el archivo: " + errorSubida.message);
          return;
        }

        const { data } = supabase.storage
          .from("animaciones")
          .getPublicUrl(ruta);

        urlFinal = data.publicUrl;
        tipoFinal = archivoMedia.type.startsWith("video/")
          ? "video"
          : archivoMedia.type === "image/gif"
            ? "animacion"
            : "imagen";
      }

      const datos = {
        categoria_id: categoriaId || null,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        tipo: tipoFinal,
        media_url: urlFinal,
        miniatura_url: miniaturaUrl.trim() || null,
        orden: Number(orden) || 0,
        activo,
      };

      const resultado = animacionEditando
        ? await supabase.from("animaciones").update(datos).eq("id", animacionEditando)
        : await supabase.from("animaciones").insert(datos);

      if (resultado.error) {
        setMensaje("No se pudo guardar el contenido: " + resultado.error.message);
        return;
      }

      setMensaje("Contenido guardado correctamente.");
      limpiarAnimacion();
      await cargarDatos();
    } catch (error) {
      setMensaje("Ocurrió un error: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setSubiendo(false);
    }
  }

  function editarAnimacion(item: Animacion) {
    setAnimacionEditando(item.id);
    setCategoriaId(item.categoria_id || "");
    setTitulo(item.titulo);
    setDescripcion(item.descripcion || "");
    setTipo(item.tipo || "video");
    setMediaUrl(item.media_url || "");
    setMiniaturaUrl(item.miniatura_url || "");
    setOrden(String(item.orden ?? 0));
    setActivo(item.activo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function eliminarAnimacion(id: string) {
    if (!confirm("¿Eliminar este contenido?")) return;

    const { error } = await supabase.from("animaciones").delete().eq("id", id);

    if (error) setMensaje("No se pudo eliminar: " + error.message);
    else {
      setMensaje("Contenido eliminado.");
      await cargarDatos();
    }
  }

  if (cargando) {
    return <main className="min-h-screen bg-slate-950 p-10 text-white">Verificando acceso...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-amber-400">TRAIN Football</p>
            <h1 className="text-3xl font-black">Gestión de animaciones</h1>
            <p className="mt-1 text-sm text-gray-400">Sesión: {email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/animaciones" className="rounded-lg border border-white/20 px-4 py-2">
              Ver sección pública
            </Link>
            <Link href="/admin/admin" className="rounded-lg border border-white/20 px-4 py-2">
              Panel principal
            </Link>
            <button onClick={cerrarSesion} className="rounded-lg bg-red-700 px-4 py-2">
              Cerrar sesión
            </button>
          </div>
        </header>

        {mensaje && (
          <div className="mb-6 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-amber-200">
            {mensaje}
          </div>
        )}

        <section className="mb-10 rounded-2xl bg-white p-6 text-gray-900">
          <h2 className="mb-5 text-2xl font-bold">
            {categoriaEditando ? "Editar categoría" : "Crear categoría"}
          </h2>

          <form onSubmit={guardarCategoria} className="grid gap-4 md:grid-cols-2">
            <input className={campo} placeholder="Nombre de la categoría" value={nombreCategoria} onChange={e => setNombreCategoria(e.target.value)} required />
            <input className={campo} placeholder="Descripción" value={descripcionCategoria} onChange={e => setDescripcionCategoria(e.target.value)} />
            <input className={campo} type="number" placeholder="Orden" value={ordenCategoria} onChange={e => setOrdenCategoria(e.target.value)} />
            <div className="flex flex-wrap gap-3">
              <button className={boton} type="submit">{categoriaEditando ? "Actualizar categoría" : "Crear categoría"}</button>
              {categoriaEditando && <button type="button" onClick={limpiarCategoria} className="rounded-lg border px-5 py-3">Cancelar</button>}
            </div>
          </form>

          <h3 className="mb-3 mt-8 font-bold">Categorías existentes</h3>
          <div className="space-y-2">
            {categorias.map(cat => (
              <div key={cat.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <strong>{cat.nombre}</strong>
                  <p className="text-sm text-gray-500">{cat.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editarCategoria(cat)} className="rounded bg-slate-200 px-3 py-2">Editar</button>
                  <button onClick={() => eliminarCategoria(cat.id)} className="rounded bg-red-100 px-3 py-2 text-red-700">Eliminar</button>
                </div>
              </div>
            ))}
            {categorias.length === 0 && <p className="text-gray-500">Todavía no hay categorías.</p>}
          </div>
        </section>

        <section className="mb-10 rounded-2xl bg-white p-6 text-gray-900">
          <h2 className="mb-5 text-2xl font-bold">
            {animacionEditando ? "Editar contenido" : "Cargar nueva animación"}
          </h2>

          <form onSubmit={guardarAnimacion} className="grid gap-4 md:grid-cols-2">
            <input className={campo} placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <select className={campo} value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
              <option value="">Sin categoría</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
            <textarea className={`${campo} md:col-span-2`} placeholder="Descripción del contenido" rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            <select className={campo} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="video">Video</option>
              <option value="imagen">Imagen</option>
              <option value="animacion">Animación</option>
              <option value="documento">Documento</option>
              <option value="enlace">Enlace externo</option>
            </select>
            <input className={campo} type="number" placeholder="Orden" value={orden} onChange={e => setOrden(e.target.value)} />
            <div className="md:col-span-2 space-y-2">
              <label className="block font-semibold">Subir foto, GIF o video desde tu dispositivo</label>
              <input
                className={campo}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                onChange={e => setArchivoMedia(e.target.files?.[0] || null)}
              />
              {archivoMedia && (
                <p className="text-sm text-emerald-700">
                  Archivo seleccionado: {archivoMedia.name}
                </p>
              )}
              <p className="text-sm text-gray-500">Máximo 100 MB. También podés seguir utilizando una URL.</p>
            </div>
            <input className={campo} placeholder="URL del video, imagen o recurso (opcional)" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
            <input className={campo} placeholder="URL de miniatura (opcional)" value={miniaturaUrl} onChange={e => setMiniaturaUrl(e.target.value)} />
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
              Mostrar contenido en la sección pública
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button className={boton} type="submit" disabled={subiendo}>{subiendo ? "Subiendo archivo..." : animacionEditando ? "Actualizar contenido" : "Guardar contenido"}</button>
              {animacionEditando && <button type="button" onClick={limpiarAnimacion} className="rounded-lg border px-5 py-3">Cancelar edición</button>}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-2xl font-bold">Contenidos cargados</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {animaciones.map(item => (
              <article key={item.id} className="rounded-xl border border-white/10 bg-slate-900 p-4">
                <p className="text-xs uppercase text-amber-400">{item.tipo || "Contenido"} · {item.activo ? "Publicado" : "Oculto"}</p>
                <h3 className="mt-2 text-lg font-bold">{item.titulo}</h3>
                <p className="mt-1 text-sm text-gray-400">{item.descripcion}</p>
                <p className="mt-2 break-all text-xs text-gray-500">{item.media_url}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => editarAnimacion(item)} className="rounded bg-amber-400 px-3 py-2 font-bold text-black">Editar</button>
                  <button onClick={() => eliminarAnimacion(item.id)} className="rounded bg-red-700 px-3 py-2">Eliminar</button>
                </div>
              </article>
            ))}
            {animaciones.length === 0 && <p className="text-gray-400">Todavía no hay contenidos cargados.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
