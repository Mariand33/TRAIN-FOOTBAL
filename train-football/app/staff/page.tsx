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
  trayectoria: {
    club: string;
    cargo: string;
    periodo: string;
    escudo_url: string;
  }[] | null;
};

export default function StaffPage() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [integranteSeleccionado, setIntegranteSeleccionado] =
    useState<Integrante | null>(null);

  useEffect(() => {
    async function cargarStaff() {
      const { data, error } = await supabase
        .from("staff_train_football")
        .select(
          "id, nombre, cargo, descripcion, foto_url, cv_url, orden, foto_zoom, foto_x, foto_y, trayectoria"
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
            TRAIN Football · EN BUSCA DE LA EXCELENCIA
          </p>

          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 56px)",
              fontWeight: 900,
              margin: "15px 0",
            }}
          >
            STAFF <span style={{ color: "#e8bd59" }}>TRAIN Football</span>
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
                onClick={() => setIntegranteSeleccionado(persona)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIntegranteSeleccionado(persona);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Ver perfil de ${persona.nombre}`}
                style={{
                  background: "linear-gradient(145deg, #171e45, #101633)",
                  border: "1px solid #343d69",
                  borderRadius: 20,
                  padding: 28,
                  textAlign: "center",
                  boxShadow: "0 10px 30px #0005",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
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
          TRAIN Football · 10 AÑOS FORMANDO Y CAPACITANDO
        </div>
      </section>

      {integranteSeleccionado && (
        <div
          onClick={() => setIntegranteSeleccionado(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(2, 5, 18, 0.88)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            overflowY: "auto",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="perfil-staff-titulo"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 850,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "linear-gradient(145deg, #171e45, #080d24)",
              border: "1px solid #b89443",
              borderRadius: 22,
              padding: "32px clamp(20px, 5vw, 42px)",
              boxShadow: "0 25px 80px #000b",
            }}
          >
            <button
              type="button"
              onClick={() => setIntegranteSeleccionado(null)}
              aria-label="Cerrar perfil"
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid #657096",
                background: "#252e58",
                color: "white",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <div style={{ textAlign: "center", padding: "10px 15px 28px" }}>
              {integranteSeleccionado.foto_url && (
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    border: "4px solid #e8bd59",
                    overflow: "hidden",
                    margin: "0 auto 20px",
                    boxSizing: "border-box",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={integranteSeleccionado.foto_url}
                    alt={integranteSeleccionado.nombre}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: `${integranteSeleccionado.foto_x ?? 50}% ${integranteSeleccionado.foto_y ?? 50}%`,
                      transform: `scale(${integranteSeleccionado.foto_zoom ?? 1})`,
                    }}
                  />
                </div>
              )}

              <p style={{ color: "#e8bd59", letterSpacing: 3, fontSize: 12, fontWeight: 800 }}>
                TRAIN FOOTBALL · STAFF PROFESIONAL
              </p>
              <h2 id="perfil-staff-titulo" style={{ fontSize: "clamp(25px, 5vw, 36px)", fontWeight: 900, margin: "12px 0" }}>
                {integranteSeleccionado.nombre}
              </h2>
              <p style={{ color: "#e8bd59", fontWeight: 800, fontSize: 17 }}>
                {integranteSeleccionado.cargo}
              </p>
            </div>

            {integranteSeleccionado.descripcion && (
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ color: "#e8bd59", fontSize: 18, marginBottom: 10 }}>
                  Perfil profesional
                </h3>
                <p style={{ color: "#d5d9e8", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {integranteSeleccionado.descripcion}
                </p>
              </div>
            )}

            <div>
              <h3 style={{ color: "#e8bd59", fontSize: 20, marginBottom: 18 }}>
                Trayectoria profesional
              </h3>

              {integranteSeleccionado.trayectoria?.filter(
                (item) => item.club || item.cargo || item.periodo
              ).length ? (
                <div style={{ display: "grid", gap: 13 }}>
                  {integranteSeleccionado.trayectoria
                    .filter((item) => item.club || item.cargo || item.periodo)
                    .map((item, indice) => (
                      <div
                        key={`${item.club}-${indice}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: 16,
                          borderRadius: 14,
                          background: "#ffffff0a",
                          border: "1px solid #343d69",
                        }}
                      >
                        {item.escudo_url ? (
                          <img
                            src={item.escudo_url}
                            alt={`Escudo de ${item.club}`}
                            style={{ width: 58, height: 58, objectFit: "contain", flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 58, height: 58, borderRadius: 12, background: "#252e58", flexShrink: 0 }} />
                        )}
                        <div>
                          <p style={{ color: "white", fontWeight: 800, fontSize: 16 }}>
                            {item.club}
                          </p>
                          {item.cargo && <p style={{ color: "#d5d9e8", marginTop: 4 }}>{item.cargo}</p>}
                          {item.periodo && <p style={{ color: "#e8bd59", fontSize: 13, marginTop: 4 }}>{item.periodo}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p style={{ color: "#aeb7d4", lineHeight: 1.7 }}>
                  La trayectoria profesional de este integrante se actualizará próximamente.
                </p>
              )}
            </div>

            <p style={{ color: "#aeb7d4", textAlign: "center", fontSize: 11, letterSpacing: 2, marginTop: 30 }}>
              TRAIN FOOTBALL · 10 AÑOS FORMANDO Y CAPACITANDO
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
