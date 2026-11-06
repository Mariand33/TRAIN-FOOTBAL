"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";

type Sponsor = {
  id: string;
  nombre: string;
  logo_url: string | null;
  orden: number;
  activo: boolean;
};

const BUCKET = "sponsors-train-football";

export default function AdministrarAuspiciantes() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [nombre, setNombre] = useState("");
  const [orden, setOrden] = useState("0");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function iniciar() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      await cargar();
      setCargando(false);
    }
    iniciar();
  }, [router]);

  async function cargar() {
    const { data, error } = await supabase
      .from("sponsors_train_football")
      .select("*")
      .order("orden", { ascending: true });

    if (error) {
      setMensaje("Error al cargar: " + error.message);
      return;
    }
    setSponsors(data ?? []);
  }

  function limpiar() {
    setNombre("");
    setOrden("0");
    setLogo(null);
    setPreview("");
    setEditando(null);
  }

  function editar(s: Sponsor) {
    setEditando(s.id);
    setNombre(s.nombre);
    setOrden(String(s.orden ?? 0));
    setPreview(s.logo_url ?? "");
    setLogo(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje("Ingresá el nombre del auspiciante.");
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

      let logoUrl = sponsors.find(s => s.id === editando)?.logo_url ?? null;

      if (logo) {
        const extension = logo.name.split(".").pop()?.toLowerCase() || "jpg";
        const ruta = `auspiciantes/${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(ruta, logo, { contentType: logo.type });

        if (error) throw new Error(error.message);

        logoUrl = supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
      }

      if (editando) {
        const { error } = await supabase
          .from("sponsors_train_football")
          .update({
            nombre: nombre.trim(),
            orden: Number(orden) || 0,
            logo_url: logoUrl,
          })
          .eq("id", editando);

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("sponsors_train_football")
          .insert({
            nombre: nombre.trim(),
            orden: Number(orden) || 0,
            logo_url: logoUrl,
            activo: true,
          });

        if (error) throw new Error(error.message);
      }

      await cargar();
      limpiar();
      setMensaje("Auspiciante guardado correctamente.");
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(s: Sponsor) {
    if (!confirm(`¿Eliminar a ${s.nombre}?`)) return;

    const { error } = await supabase
      .from("sponsors_train_football")
      .delete()
      .eq("id", s.id);

    if (error) {
      setMensaje("Error al eliminar: " + error.message);
      return;
    }

    await cargar();
    setMensaje("Auspiciante eliminado.");
  }

  if (cargando) return <main className="min-h-screen bg-[#080d1b] p-10 text-white">Cargando...</main>;

  return (
    <main className="min-h-screen bg-[#080d1b] px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/admin" className="text-sm text-amber-300">← Volver al panel</a>

        <h1 className="mt-6 text-3xl font-black text-amber-300">Auspiciantes</h1>
        <p className="mt-2 text-gray-400">Administrá los logos que aparecen en la página principal.</p>

        <form onSubmit={guardar} className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-[#10182a] p-6">
          <h2 className="text-xl font-bold">{editando ? "Editar auspiciante" : "Agregar auspiciante"}</h2>

          <label className="text-sm text-gray-300">
            Nombre
            <input value={nombre} onChange={e => setNombre(e.target.value)} required className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d1b] p-3 text-white" />
          </label>

          <label className="text-sm text-gray-300">
            Orden de aparición
            <input type="number" value={orden} onChange={e => setOrden(e.target.value)} className="mt-2 w-full rounded-lg border border-white/20 bg-[#080d1b] p-3 text-white" />
          </label>

          <label className="text-sm text-gray-300">
            Logo (JPG, PNG o WEBP; máximo 5 MB)
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => {
              const f = e.target.files?.[0] ?? null;
              if (f && f.size > 5 * 1024 * 1024) {
                setMensaje("El logo no puede superar los 5 MB.");
                return;
              }
              setLogo(f);
              if (f) setPreview(URL.createObjectURL(f));
            }} className="mt-2 block w-full text-sm" />
          </label>

          {preview && <div className="flex h-28 w-full items-center justify-center rounded-xl bg-white p-3">
            <img src={preview} alt="Vista previa del logo" className="h-full max-w-full object-contain" />
          </div>}

          <div className="flex flex-wrap gap-3">
            <button disabled={guardando} className="rounded-full bg-amber-300 px-6 py-3 font-bold text-[#080d1b] disabled:opacity-50">
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar auspiciante"}
            </button>
            {editando && <button type="button" onClick={limpiar} className="rounded-full border border-white/20 px-6 py-3">Cancelar</button>}
          </div>

          {mensaje && <p className="text-sm text-amber-200">{mensaje}</p>}
        </form>

        <h2 className="mt-10 text-xl font-bold">Auspiciantes cargados ({sponsors.length})</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map(s => (
            <article key={s.id} className="rounded-xl border border-white/10 bg-[#10182a] p-4">
              <div className="flex h-28 items-center justify-center rounded-lg bg-white p-3">
                {s.logo_url ? <img src={s.logo_url} alt={s.nombre} className="h-full max-w-full object-contain" /> : <span className="text-gray-500">Sin logo</span>}
              </div>
              <h3 className="mt-3 font-bold">{s.nombre}</h3>
              <p className="text-xs text-gray-400">Orden: {s.orden}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => editar(s)} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold">Editar</button>
                <button onClick={() => eliminar(s)} className="rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-300">Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
