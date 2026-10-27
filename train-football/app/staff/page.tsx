
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Integrante = {
  id: string;
  nombre: string;
  cargo: string;
  descripcion: string | null;
  foto_url: string | null;
  cv_url: string | null;
  orden: number;
};

export default function StaffPage() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarStaff() {
      const { data, error } = await supabase
        .from("staff_train_football")
        .select("id, nombre, cargo, descripcion, foto_url, cv_url, orden")
        .eq("activo", true)
        .order("orden", { ascending: true })
        .order("nombre", { ascending: true });

      if (error) {
        setError("No pudimos cargar el equipo. Intentá nuevamente más tarde.");
      } else {
        setIntegrantes(data ?? []);
      }

      setCargando(false);
    }

    cargarStaff();
  }, []);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      color: "#14243a",
      padding: "50px 20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{
          color: "#008c70",
          fontWeight: 800,
          letterSpacing: 2,
        }}>
          TRAIN FOOTBALL
        </p>

        <h1 style={{ fontSize: 42, marginBottom: 12 }}>
          Quiénes somos
        </h1>

        <p style={{
          fontSize: 18,
          color: "#536176",
          marginBottom: 35,
        }}>
          Conocé al equipo de profesionales que forma parte de Train Football.
        </p>

        {cargando && <p>Cargando integrantes...</p>}

        {error && <p role="alert">{error}</p>}

        {!cargando && !error && integrantes.length === 0 && (
          <p>Próximamente conocerás a nuestro equipo.</p>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 24,
        }}>
          {integrantes.map((persona) => (
            <article key={persona.id} style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 5px 20px #14243a12",
            }}>
              {persona.foto_url ? (
                <img
                  src={persona.foto_url}
                  alt={`Foto de ${persona.nombre}`}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                    borderRadius: 12,
                    marginBottom: 20,
                  }}
                />
              ) : (
                <div style={{
                  height: 190,
                  background: "#e5ebf2",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  color: "#536176",
                }}>
                  Foto próximamente
                </div>
              )}

              <h2 style={{ fontSize: 24, marginBottom: 8 }}>
                {persona.nombre}
              </h2>

              <p style={{ color: "#008c70", fontWeight: 600 }}>
                {persona.cargo}
              </p>

              {persona.descripcion && (
                <p style={{
                  color: "#536176",
                  lineHeight: 1.6,
                  marginTop: 12,
                }}>
                  {persona.descripcion}
                </p>
              )}

              {persona.cv_url && (
                <div style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 20,
                }}>
                  <a
                    href={persona.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#008c70",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: 8,
                      textDecoration: "none",
                    }}
                  >
                    Ver CV
                  </a>

                  <a
                    href={persona.cv_url}
                    download
                    style={{
                      color: "#14243a",
                      padding: "10px 14px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      textDecoration: "none",
                    }}
                  >
                    Descargar CV
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
