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
  foto_zoom: number | null;
  foto_x: number | null;
  foto_y: number | null;
};

export default function StaffPage() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarStaff() {
      const { data, error } = await supabase
        .from("staff_train_football")
        .select(
          "id, nombre, cargo, descripcion, foto_url, cv_url, orden, foto_zoom, foto_x, foto_y"
        )
        .eq("activo", true)
        .order("orden", { ascending: true })
        .order("nombre", { ascending: true });

      if (error) {
        setError("No pudimos cargar el equipo. Intentá nuevamente.");
      } else {
        setIntegrantes(data ?? []);
      }

      setCargando(false);
    }

    cargarStaff();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080d24",
        color: "white",
        padding: "65px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: 1150,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 55 }}>
          <p
            style={{
              color: "#e8bd59",
              fontWeight: 800,
              letterSpacing: 5,
              fontSize: 13,
            }}
          >
            TRAIN FOOTBALL · EN BUSCA DE LA EXCELENCIA
          </p>

          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 56px)",
              fontWeight: 900,
              margin: "15px 0",
            }}
          >
            STAFF <span style={{ color: "#e8bd59" }}>TRAIN FOOTBALL</span>
          </h1>

          <p
            style={{
              color: "#c4c9dc",
              fontSize: 17,
              maxWidth: 650,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Un equipo de profesionales comprometidos con la formación, el
            desarrollo y el crecimiento del fútbol.
          </p>
        </div>

        {cargando && <p style={{ textAlign: "center" }}>Cargando staff...</p>}

        {error && (
          <p role="alert" style={{ textAlign: "center" }}>
            {error}
          </p>
        )}

        {!cargando && !error && integrantes.length === 0 && (
          <p style={{ textAlign: "center" }}>
            Próximamente conocerás a nuestro equipo.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 25,
          }}
        >
          {integrantes.map((persona) => {
            const zoom = persona.foto_zoom ?? 1;
            const posicionX = persona.foto_x ?? 50;
            const posicionY = persona.foto_y ?? 50;

            return (
              <article
                key={persona.id}
                style={{
                  background: "linear-gradient(145deg, #171e45, #101633)",
                  border: "1px solid #343d69",
                  borderRadius: 20,
                  padding: 28,
                  textAlign: "center",
                  boxShadow: "0 10px 30px #0005",
                }}
              >
                {persona.foto_url ? (
                  <div
                    style={{
                      width: 145,
                      height: 145,
                      borderRadius: "50%",
                      border: "4px solid #e8bd59",
                      overflow: "hidden",
                      margin: "0 auto 22px",
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      src={persona.foto_url}
                      alt={`Foto de ${persona.nombre}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: `${posicionX}% ${posicionY}%`,
                        transform: `scale(${zoom})`,
                        transformOrigin: "center center",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 145,
                      height: 145,
                      borderRadius: "50%",
                      border: "4px solid #e8bd59",
                      background: "#252e58",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 22px",
                      color: "#e8bd59",
                      fontSize: 38,
                      fontWeight: 900,
                      boxSizing: "border-box",
                    }}
                  >
                    {persona.nombre.charAt(0)}
                  </div>
                )}

                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    marginBottom: 12,
                  }}
                >
                  {persona.nombre}
                </h2>

                <div
                  style={{
                    width: 45,
                    height: 3,
                    background: "#e8bd59",
                    margin: "0 auto 15px",
                  }}
                />

                <p
                  style={{
                    color: "#e8bd59",
                    fontSize: 15,
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  {persona.cargo}
                </p>
              </article>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 65,
            color: "#aeb7d4",
            fontSize: 13,
            letterSpacing: 3,
          }}
        >
          TRAIN FOOTBALL · 10 AÑOS FORMANDO Y CAPACITANDO
        </div>
      </section>
    </main>
  );
}
