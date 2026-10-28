
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";

type Material = {
  id: string;
  titulo: string;
  descripcion: string | null;
  curso: string;
  tipo: string;
  archivo_url: string | null;
  video_url: string | null;
  creado_por: string | null;
  created_at: string;
};

const cursos = [
  "Modelos de juego en fútbol",
  "Planificación en fútbol infantil y juvenil",
  "Principios tácticos del fútbol",
  "Entrenamiento de fútbol competitivo",
  "Preparación física contextualizada al fútbol",
  "Otros cursos y capacitaciones",
];

const inputStyle = {
  width: "100%",
  padding: 12,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "white",
  color: "#172033",
};

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [curso, setCurso] = useState(cursos[0]);
  const [tipo, setTipo] = useState("documento");
  const [archivoUrl, setArchivoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      setEmail(data.session.user.email ?? "");
      setChecking(false);
      await cargarMateriales();
    }

    checkSession();

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

  async function cargarMateriales() {
    const { data, error } = await supabase
      .from("materiales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMensaje("No se pudieron cargar los materiales: " + error.message);
      return;
    }

    setMateriales((data ?? []) as Material[]);
  }

  function limpiarFormulario() {
    setTitulo("");
    setDescripcion("");
    setCurso(cursos[0]);
    setTipo("documento");
    setArchivoUrl("");
    setVideoUrl("");
    setEditandoId(null);
  }

  async function guardarMaterial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const { data: { user }, error: userError } =
      await supabase.auth.getUser();

    if (userError || !user) {
      setMensaje("Tu sesión no está disponible. Volvé a iniciar sesión.");
      setGuardando(false);
      router.replace("/admin/login");
      return;
    }

    const registro = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || null,
      curso,
      tipo,
      archivo_url: archivoUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      creado_por: user.id,
    };

    const resultado = editandoId
      ? await supabase
          .from("materiales")
          .update(registro)
          .eq("id", editandoId)
      : await supabase.from("materiales").insert(registro);

    setGuardando(false);

    if (resultado.error) {
      setMensaje("No se pudo guardar: " + resultado.error.message);
      return;
    }

    setMensaje(editandoId ? "Material actualizado." : "Material guardado correctamente.");
    limpiarFormulario();
    await cargarMateriales();
  }

  function editarMaterial(material: Material) {
    setEditandoId(material.id);
    setTitulo(material.titulo);
    setDescripcion(material.descripcion ?? "");
    setCurso(material.curso);
    setTipo(material.tipo);
    setArchivoUrl(material.archivo_url ?? "");
    setVideoUrl(material.video_url ?? "");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function eliminarMaterial(id: string) {
    if (!window.confirm("¿Querés eliminar este material?")) return;

    const { error } = await supabase
      .from("materiales")
      .delete()
      .eq("id", id);

    if (error) {
      setMensaje("No se pudo eliminar: " + error.message);
      return;
    }

    setMensaje("Material eliminado.");
    await cargarMateriales();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (checking) {
    return <main style={{ padding: 32 }}>Verificando acceso...</main>;
  }

  return (
    <main style={{
      minHeight: "100vh",
      padding: 24,
      background: "#f1f5f9",
      color: "#172033",
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 28,
      }}>
        <div>
          <p style={{ color: "#087f5b", fontWeight: 800 }}>TRAIN FOOTBALL</p>
          <h1 style={{ fontSize: 30, fontWeight: 800 }}>Panel de administración</h1>
          <p>Sesión iniciada: {email}</p>
        </div>
        <button onClick={handleLogout} style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: "#172033",
          color: "white",
          cursor: "pointer",
        }}>
          Cerrar sesión
        </button>
      </header>

      {mensaje && (
        <p role="status" style={{
          padding: 12,
          marginBottom: 20,
          background: "white",
          borderRadius: 8,
          overflowWrap: "anywhere",
        }}>
          {mensaje}
        </p>
      )}

      <section style={{
        padding: 24,
        background: "white",
        borderRadius: 14,
        marginBottom: 28,
        maxWidth: 850,
      }}>
        <h2 style={{ fontSize: 23, fontWeight: 800, marginBottom: 18 }}>
          {editandoId ? "Editar material" : "Cargar nuevo material"}
        </h2>

        <form onSubmit={guardarMaterial} style={{
          display: "grid",
          gap: 14,
        }}>
          <label>
            Título *
            <input
              required
              maxLength={200}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={inputStyle}
              placeholder="Ej.: Principios de ataque"
            />
          </label>

          <label>
            Curso *
            <select
              required
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              style={inputStyle}
            >
              {cursos.map((nombre) => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
            </select>
          </label>

          <label>
            Descripción
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ ...inputStyle, minHeight: 100 }}
              placeholder="Explicá brevemente el contenido."
            />
          </label>

          <label>
            Tipo de material
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={inputStyle}
            >
              <option value="documento">Documento o PDF</option>
              <option value="video">Video</option>
              <option value="enlace">Enlace externo</option>
              <option value="presentacion">Presentación</option>
            </select>
          </label>

          <label>
            Enlace al archivo (opcional)
            <input
              type="url"
              value={archivoUrl}
              onChange={(e) => setArchivoUrl(e.target.value)}
              style={inputStyle}
              placeholder="https://..."
            />
          </label>

          <label>
            Enlace al video (opcional)
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={inputStyle}
              placeholder="https://youtube.com/..."
            />
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={guardando}
              style={{
                padding: "12px 18px",
                borderRadius: 8,
                background: "#087f5b",
                color: "white",
                fontWeight: 700,
                cursor: guardando ? "wait" : "pointer",
              }}
            >
              {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Publicar material"}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={limpiarFormulario}
                style={{ padding: 12, borderRadius: 8, cursor: "pointer" }}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 23, fontWeight: 800, marginBottom: 16 }}>
          Materiales cargados ({materiales.length})
        </h2>

        {materiales.length === 0 ? (
          <p>Todavía no hay materiales guardados.</p>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {materiales.map((material) => (
              <article key={material.id} style={{
                padding: 20,
                background: "white",
                borderRadius: 12,
                overflowWrap: "anywhere",
              }}>
                <p style={{ color: "#087f5b", fontWeight: 700 }}>{material.curso}</p>
                <h3 style={{ fontSize: 19, fontWeight: 800 }}>{material.titulo}</h3>
                {material.descripcion && <p style={{ marginTop: 8 }}>{material.descripcion}</p>}
                <p style={{ marginTop: 8, color: "#64748b" }}>Tipo: {material.tipo}</p>

                {material.archivo_url && (
                  <p><a href={material.archivo_url} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Abrir archivo ↗</a></p>
                )}
                {material.video_url && (
                  <p><a href={material.video_url} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Ver video ↗</a></p>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button onClick={() => editarMaterial(material)} style={{ padding: 10, borderRadius: 8, cursor: "pointer" }}>
                    Editar
                  </button>
                  <button onClick={() => eliminarMaterial(material.id)} style={{ padding: 10, borderRadius: 8, color: "#b91c1c", cursor: "pointer" }}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
