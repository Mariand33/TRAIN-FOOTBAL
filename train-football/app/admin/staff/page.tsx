
"use client";

import { useEffect, useState, type FormEvent, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";

type Integrante = {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string | null;
  foto_url: string | null;
  cv_url: string | null;
  orden: number;
  foto_zoom: number | null;
  foto_x: number | null;
  foto_y: number | null;
};

const BUCKET_FOTOS = "staff-train-football";
const BUCKET_CV = "cv-equipo";

export default function AdministrarStaff() {
  const router = useRouter();

  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [editando, setEditando] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState("0");

  const [foto, setFoto] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [fotoZoom, setFotoZoom] = useState(1);
  const [fotoX, setFotoX] = useState(50);
  const [fotoY, setFotoY] = useState(50);

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

      await cargarIntegrantes();
      setCargando(false);
    }

    iniciar();
  }, [router]);

  async function cargarIntegrantes() {
    const { data, error } = await supabase
      .from("staff_train_football")
      .select("id, nombre, cargo, descripcion, foto_url, cv_url, orden, foto_zoom, foto_x, foto_y")
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true });

    if (error) {
      setMensaje("Error al cargar: " + error.message);
      return;
    }

    setIntegrantes(data ?? []);
  }

  function limpiarFormulario() {
    setEditando(null);
    setNombre("");
    setCargo("");
    setDescripcion("");
    setOrden("0");
    setFoto(null);
    setCv(null);
    setFotoPreview("");
    setFotoZoom(1);
    setFotoX(50);
    setFotoY(50);
  }

  function editarIntegrante(persona: Integrante) {
    setEditando(persona.id);
    setNombre(persona.nombre);
    setCargo(persona.cargo);
    setDescripcion(persona.descripcion ?? "");
    setOrden(String(persona.orden ?? 0));
    setFoto(null);
    setCv(null);
    setFotoPreview(persona.foto_url ?? "");
    setFotoZoom(persona.foto_zoom ?? 1);
    setFotoX(persona.foto_x ?? 50);
    setFotoY(persona.foto_y ?? 50);

    setMensaje("Editando a " + persona.nombre);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function seleccionarFoto(archivo: File | null) {
    setFoto(null);

    if (!archivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
      setMensaje("La foto debe ser JPG, PNG o WEBP.");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setMensaje("La foto no puede superar los 5 MB.");
      return;
    }

    setFoto(archivo);
    setFotoPreview(URL.createObjectURL(archivo));
    setMensaje("");
  }

  function seleccionarCV(archivo: File | null) {
    setCv(null);

    if (!archivo) return;

    if (archivo.type !== "application/pdf") {
      setMensaje("El CV debe estar en formato PDF.");
      return;
    }

    if (archivo.size > 10 * 1024 * 1024) {
      setMensaje("El CV no puede superar los 10 MB.");
      return;
    }

    setCv(archivo);
    setMensaje("");
  }

  async function subirFoto(archivo: File, id: string) {
    const extension = archivo.name.split(".").pop()?.toLowerCase() || "jpg";
    const ruta = `integrantes/${id}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET_FOTOS)
      .upload(ruta, archivo, {
        contentType: archivo.type,
        upsert: false,
      });

    if (error) throw new Error("Error al subir la foto: " + error.message);

    const { data } = supabase.storage
      .from(BUCKET_FOTOS)
      .getPublicUrl(ruta);

    return data.publicUrl;
  }

  async function subirCV(archivo: File, id: string) {
    const ruta = `integrantes/${id}/${Date.now()}.pdf`;

    const { error } = await supabase.storage
      .from(BUCKET_CV)
      .upload(ruta, archivo, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) throw new Error("Error al subir el CV: " + error.message);

    return ruta;
  }

  async function guardarIntegrante(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nombre.trim() || !cargo.trim()) {
      setMensaje("Completá el nombre y el cargo.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      const { data: sesion, error: errorSesion } =
        await supabase.auth.getSession();

      if (errorSesion || !sesion.session) {
        setMensaje("Tu sesión venció. Volvé a iniciar sesión.");
        router.replace("/admin/login");
        return;
      }

      let id = editando;
      let fotoAnterior: string | null = null;
      let cvAnterior: string | null = null;

      if (editando) {
        const actual = integrantes.find((p) => p.id === editando);
        fotoAnterior = actual?.foto_url ?? null;
        cvAnterior = actual?.cv_url ?? null;
      } else {
        const { data, error } = await supabase
          .from("staff_train_football")
          .insert({
            nombre: nombre.trim(),
            cargo: cargo.trim(),
            descripcion: descripcion.trim() || null,
            orden: Number(orden) || 0,
            activo: true,
            creado_por: sesion.session.user.id,
          })
          .select("id")
          .single();

        if (error) throw new Error("No se pudo crear: " + error.message);
        id = data.id;
      }

      let nuevaFoto = fotoAnterior;
      let nuevoCV = cvAnterior;

      if (foto && id) {
        nuevaFoto = await subirFoto(foto, id);
      }

      if (cv && id) {
        nuevoCV = await subirCV(cv, id);
      }

      const { error: errorActualizacion } = await supabase
        .from("staff_train_football")
        .update({
          nombre: nombre.trim(),
          cargo: cargo.trim(),
          descripcion: descripcion.trim() || null,
          orden: Number(orden) || 0,
          foto_url: nuevaFoto,
          cv_url: nuevoCV,
          foto_zoom: fotoZoom,
          foto_x: fotoX,
          foto_y: fotoY,
        })
        .eq("id", id);

      if (errorActualizacion) {
        throw new Error("No se pudieron guardar los cambios: " + errorActualizacion.message);
      }

      // Los archivos anteriores se eliminan solamente después de guardar
      // correctamente las nuevas referencias en la tabla.
      if (foto && fotoAnterior) {
        const rutaAnterior = extraerRutaPublica(fotoAnterior, BUCKET_FOTOS);
        if (rutaAnterior) {
          await supabase.storage.from(BUCKET_FOTOS).remove([rutaAnterior]);
        }
      }

      if (cv && cvAnterior) {
        await supabase.storage.from(BUCKET_CV).remove([cvAnterior]);
      }

      setMensaje(editando ? "Integrante actualizado correctamente." : "Integrante agregado correctamente.");
      limpiarFormulario();
      await cargarIntegrantes();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Ocurrió un error.");
    } finally {
      setGuardando(false);
    }
  }

  function extraerRutaPublica(url: string, bucket: string) {
    const marcador = `/storage/v1/object/public/${bucket}/`;
    const posicion = url.indexOf(marcador);

    if (posicion === -1) return null;

    return decodeURIComponent(url.substring(posicion + marcador.length));
  }

  async function abrirCV(ruta: string) {
    setMensaje("");

    const { data, error } = await supabase.storage
      .from(BUCKET_CV)
      .createSignedUrl(ruta, 60);

    if (error) {
      setMensaje("No se pudo abrir el CV: " + error.message);
      return;
    }

    window.location.assign(data.signedUrl);
  }

  async function eliminarIntegrante(persona: Integrante) {
    if (!confirm(`¿Querés eliminar a ${persona.nombre}?`)) return;

    setMensaje("");

    const { error } = await supabase
      .from("staff_train_football")
      .delete()
      .eq("id", persona.id);

    if (error) {
      setMensaje("No se pudo eliminar: " + error.message);
      return;
    }

    const fotoRuta = persona.foto_url
      ? extraerRutaPublica(persona.foto_url, BUCKET_FOTOS)
      : null;

    if (fotoRuta) {
      await supabase.storage.from(BUCKET_FOTOS).remove([fotoRuta]);
    }

    if (persona.cv_url) {
      await supabase.storage.from(BUCKET_CV).remove([persona.cv_url]);
    }

    setMensaje("Integrante eliminado.");
    await cargarIntegrantes();
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const campo: CSSProperties = {
    width: "100%",
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    marginTop: 6,
    boxSizing: "border-box",
  };

  const boton: CSSProperties = {
    padding: "10px 14px",
    border: 0,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  };

  if (cargando) {
    return <main style={{ padding: 30 }}>Verificando sesión...</main>;
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      color: "#14243a",
      padding: "35px 20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ maxWidth: 950, margin: "0 auto" }}>
        <p style={{ color: "#008c70", fontWeight: 800 }}>TRAIN FOOTBALL</p>
        <h1>Administrar Staff</h1>
        <p>Gestioná integrantes, fotos, descripciones y CV del equipo.</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={boton} onClick={() => router.push("/admin")}>
            Volver al panel
          </button>
          <button style={boton} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>

        <form onSubmit={guardarIntegrante} style={{
          background: "white",
          padding: 24,
          borderRadius: 14,
          marginTop: 25,
          display: "grid",
          gap: 16,
          boxShadow: "0 4px 20px #0000000a",
        }}>
          <h2>{editando ? "Editar integrante" : "Agregar integrante"}</h2>

          <label>
            Nombre completo
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={campo}
            />
          </label>

          <label>
            Cargo o especialidad
            <input
              required
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              style={campo}
            />
          </label>

          <label>
            Descripción
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={campo}
              rows={4}
            />
          </label>

          <label>
            Orden de aparición
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              style={campo}
            />
          </label>

          <div>
            <label>
              Foto del integrante (JPG, PNG o WEBP)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => seleccionarFoto(e.target.files?.[0] ?? null)}
                style={{ ...campo, border: 0, paddingLeft: 0 }}
              />
            </label>

            {fotoPreview && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontWeight: 700, marginBottom: 10 }}>Ajustar encuadre de la foto</p>
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "4px solid #e8bd59",
                    marginBottom: 14,
                    background: "#e2e8f0",
                  }}
                >
                  <img
                    src={fotoPreview}
                    alt="Vista previa del recorte"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: `${fotoX}% ${fotoY}%`,
                      transform: `scale(${fotoZoom})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>

                <label style={{ display: "block", maxWidth: 420, marginBottom: 12 }}>
                  Zoom: {fotoZoom.toFixed(2)}x
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={fotoZoom}
                    onChange={(e) => setFotoZoom(Number(e.target.value))}
                    style={{ ...campo, padding: 0, accentColor: "#008c70" }}
                  />
                </label>

                <label style={{ display: "block", maxWidth: 420, marginBottom: 12 }}>
                  Posición horizontal: {fotoX}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={fotoX}
                    onChange={(e) => setFotoX(Number(e.target.value))}
                    style={{ ...campo, padding: 0, accentColor: "#008c70" }}
                  />
                </label>

                <label style={{ display: "block", maxWidth: 420, marginBottom: 12 }}>
                  Posición vertical: {fotoY}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={fotoY}
                    onChange={(e) => setFotoY(Number(e.target.value))}
                    style={{ ...campo, padding: 0, accentColor: "#008c70" }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => { setFotoZoom(1); setFotoX(50); setFotoY(50); }}
                  style={{ ...boton, background: "#e2e8f0" }}
                >
                  Restablecer encuadre
                </button>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 10 }}>
                  Esta vista circular muestra cómo se verá la foto en la página pública.
                </p>
              </div>
            )}
          </div>

          <label>
            CV en PDF (privado)
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => seleccionarCV(e.target.files?.[0] ?? null)}
              style={{ ...campo, border: 0, paddingLeft: 0 }}
            />
            {cv && (
              <p style={{ color: "#008c70", fontSize: 13 }}>
                Archivo seleccionado: {cv.name}
              </p>
            )}
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={guardando}
              style={{
                ...boton,
                background: "#008c70",
                color: "white",
                padding: 14,
              }}
            >
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar integrante"}
            </button>

            {editando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                style={{ ...boton, background: "#e2e8f0" }}
              >
                Cancelar edición
              </button>
            )}
          </div>

          {mensaje && <p role="status">{mensaje}</p>}
        </form>

        <section style={{ marginTop: 35 }}>
          <h2>Integrantes cargados ({integrantes.length})</h2>

          {integrantes.map((persona) => (
            <article
              key={persona.id}
              style={{
                background: "white",
                padding: 18,
                borderRadius: 12,
                marginBottom: 14,
                display: "flex",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
                boxShadow: "0 3px 15px #00000008",
              }}
            >
              {persona.foto_url ? (
                <div
                  style={{
                    width: 85,
                    height: 85,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#e2e8f0",
                  }}
                >
                  <img
                    src={persona.foto_url}
                    alt={persona.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: `${persona.foto_x ?? 50}% ${persona.foto_y ?? 50}%`,
                      transform: `scale(${persona.foto_zoom ?? 1})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  width: 85,
                  height: 85,
                  borderRadius: "50%",
                  background: "#e2e8f0",
                  display: "grid",
                  placeItems: "center",
                  color: "#64748b",
                }}>
                  Sin foto
                </div>
              )}

              <div style={{ flex: 1, minWidth: 180 }}>
                <strong>{persona.nombre}</strong>
                <p style={{ margin: "5px 0" }}>{persona.cargo}</p>
                {persona.descripcion && (
                  <p style={{ color: "#64748b", fontSize: 14 }}>
                    {persona.descripcion}
                  </p>
                )}
                <small>Orden: {persona.orden}</small>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => editarIntegrante(persona)}
                  style={{ ...boton, background: "#e0f2fe" }}
                >
                  Editar
                </button>

                {persona.cv_url && (
                  <button
                    onClick={() => abrirCV(persona.cv_url!)}
                    style={{ ...boton, background: "#dcfce7" }}
                  >
                    Ver CV privado
                  </button>
                )}

                <button
                  onClick={() => eliminarIntegrante(persona)}
                  style={{ ...boton, background: "#fee2e2", color: "#991b1b" }}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}

          {integrantes.length === 0 && (
            <p>Todavía no hay integrantes cargados.</p>
          )}
        </section>
      </div>
    </main>
  );
}
