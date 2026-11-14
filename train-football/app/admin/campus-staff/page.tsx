"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";

type Profesional = {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string | null;
  foto_url: string | null;
  orden: number;
  activo: boolean;
};

const TABLA = "campus_staff_train_football";
const BUCKET = "campus-staff";

export default function AdministrarCampusStaff() {
  const router = useRouter();

  const [personas, setPersonas] = useState<Profesional[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState("0");
  const [activo, setActivo] = useState(true);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoActual, setFotoActual] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function iniciar() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      await cargarPersonas();
      setCargando(false);
    }

    iniciar();
  }, [router]);

  async function cargarPersonas() {
    const { data, error } = await supabase
      .from(TABLA)
      .select("*")
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true });

    if (error) {
      setMensaje("Error al cargar: " + error.message);
      return;
    }

    setPersonas(data ?? []);
  }

  function limpiarFormulario() {
    setEditando(null);
    setNombre("");
    setCargo("");
    setDescripcion("");
    setOrden(String(personas.length + 1));
    setActivo(true);
    setFoto(null);
    setFotoActual("");
  }

  function editar(persona: Profesional) {
    setEditando(persona.id);
    setNombre(persona.nombre);
    setCargo(persona.cargo);
    setDescripcion(persona.descripcion ?? "");
    setOrden(String(persona.orden ?? 0));
    setActivo(persona.activo);
    setFoto(null);
    setFotoActual(persona.foto_url ?? "");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nombre.trim() || !cargo.trim()) {
      setMensaje("Completá el nombre y el cargo.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      const { data: sesion } = await supabase.auth.getSession();

      if (!sesion.session) {
        router.replace("/admin/login");
        return;
      }

      let fotoUrl = fotoActual;

      if (foto) {
        const extension = foto.name.split(".").pop()?.toLowerCase() || "jpg";
        const ruta = `profesionales/${Date.now()}.${extension}`;

        const { error: errorFoto } = await supabase.storage
          .from(BUCKET)
          .upload(ruta, foto, {
            contentType: foto.type,
            upsert: false,
          });

        if (errorFoto) throw new Error("Error al subir la foto: " + errorFoto.message);

        fotoUrl = supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
      }

      const registro = {
        nombre: nombre.trim(),
        cargo: cargo.trim(),
        descripcion: descripcion.trim() || null,
        foto_url: fotoUrl || null,
        orden: Number(orden) || 0,
        activo,
      };

      const { error } = editando
        ? await supabase.from(TABLA).update(registro).eq("id", editando)
        : await supabase.from(TABLA).insert({
            ...registro,
            creado_por: sesion.session.user.id,
          });

      if (error) throw new Error("No se pudo guardar: " + error.message);

      setMensaje(editando ? "Profesional actualizado correctamente." : "Profesional agregado correctamente.");
      limpiarFormulario();
      await cargarPersonas();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Ocurrió un error.");
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(persona: Profesional) {
    const { error } = await supabase
      .from(TABLA)
      .update({ activo: !persona.activo })
      .eq("id", persona.id);

    if (error) {
      setMensaje("No se pudo cambiar el estado: " + error.message);
      return;
    }

    await cargarPersonas();
  }

  async function eliminar(persona: Profesional) {
    if (!window.confirm(`¿Eliminar a ${persona.nombre}? Esta acción no se puede deshacer.`)) return;

    const { error } = await supabase.from(TABLA).delete().eq("id", persona.id);

    if (error) {
      setMensaje("No se pudo eliminar: " + error.message);
      return;
    }

    setMensaje("Profesional eliminado.");
    if (editando === persona.id) limpiarFormulario();
    await cargarPersonas();
  }

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Verificando acceso...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-amber-400">TRAIN Football · Campus 2026</p>
            <h1 className="mt-2 text-3xl font-black">Profesionales del Campus</h1>
            <p className="mt-2 text-sm text-slate-400">Administración independiente del Staff institucional.</p>
          </div>
          <button onClick={() => router.push("/admin")} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white/10">
            ← Volver al panel
          </button>
        </header>

        <form onSubmit={guardar} className="mb-10 space-y-5 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">{editando ? "Editar profesional" : "Agregar profesional"}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold">Nombre completo
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-4 py-3 text-white" />
            </label>
            <label className="text-sm font-semibold">Cargo
              <input value={cargo} onChange={(e) => setCargo(e.target.value)} required className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-4 py-3 text-white" />
            </label>
          </div>

          <label className="block text-sm font-semibold">Descripción profesional
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} placeholder="Presentación y experiencia profesional..." className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-4 py-3 text-white" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold">Fotografía (JPG, PNG o WEBP)
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-slate-300" />
            </label>
            <label className="text-sm font-semibold">Orden de presentación
              <input type="number" value={orden} onChange={(e) => setOrden(e.target.value)} className="mt-2 w-full rounded-lg border border-white/15 bg-slate-950 px-4 py-3 text-white" />
            </label>
          </div>

          {(fotoActual || foto) && (
            <div className="flex items-center gap-4">
              <img src={foto ? URL.createObjectURL(foto) : fotoActual} alt="Vista previa" className="h-24 w-24 rounded-xl object-cover" />
              <p className="text-sm text-slate-400">Vista previa de la fotografía</p>
            </div>
          )}

          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="h-4 w-4" />
            Mostrar este profesional en la web pública
          </label>

          {mensaje && <p className="rounded-lg bg-slate-800 p-3 text-sm text-amber-300">{mensaje}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={guardando} className="rounded-full bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300 disabled:opacity-50">
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar profesional"}
            </button>
            {editando && (
              <button type="button" onClick={limpiarFormulario} className="rounded-full border border-white/20 px-6 py-3 font-bold hover:bg-white/10">
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <section>
          <h2 className="mb-5 text-xl font-bold">Profesionales cargados ({personas.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {personas.map((persona) => (
              <article key={persona.id} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
                {persona.foto_url ? (
                  <img src={persona.foto_url} alt={persona.nombre} className="h-24 w-24 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-800 text-3xl">👤</div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">{persona.nombre}</h3>
                  <p className="text-sm text-slate-400">{persona.cargo}</p>
                  <p className={`mt-1 text-xs font-bold ${persona.activo ? "text-emerald-400" : "text-slate-500"}`}>
                    {persona.activo ? "VISIBLE EN LA WEB" : "OCULTO"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => editar(persona)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold hover:bg-blue-500">Editar</button>
                    <button onClick={() => cambiarEstado(persona)} className="rounded-lg border border-white/20 px-3 py-2 text-xs font-bold hover:bg-white/10">{persona.activo ? "Ocultar" : "Activar"}</button>
                    <button onClick={() => eliminar(persona)} className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10">Eliminar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
