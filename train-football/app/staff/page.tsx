

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

  useEffect(() => {
    function cerrarConEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIntegranteSeleccionado(null);
    }

    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, []);

  return (
    <main className="staff-page">
      <style jsx>{`
        .staff-page {
          min-height: 100vh;
          padding: 85px 24px 55px;
          color: #fff;
          background:
            radial-gradient(ellipse at 50% 0%, #172d43 0%, transparent 55%),
            linear-gradient(180deg, #071321 0%, #080d19 100%);
          font-family: Arial, sans-serif;
        }

        .staff-container {
          max-width: 1250px;
          margin: auto;
        }

        .staff-header {
          text-align: center;
          margin-bottom: 58px;
        }

        .eyebrow {
          color: #a3f45b;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 5px;
          text-transform: uppercase;
        }

        .staff-title {
          margin: 18px 0;
          font-size: clamp(36px, 6vw, 64px);
          line-height: 1.05;
          font-weight: 950;
          letter-spacing: -2px;
        }

        .staff-title span {
          color: #a3f45b;
          text-shadow: 0 0 28px #a3f45535;
        }

        .staff-subtitle {
          max-width: 660px;
          margin: auto;
          color: #aebdce;
          font-size: 16px;
          line-height: 1.8;
        }

        .header-line {
          width: 75px;
          height: 4px;
          margin: 27px auto 0;
          border-radius: 10px;
          background: #a3f45b;
          box-shadow: 0 0 18px #a3f477;
        }

        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
          gap: 25px;
        }

        .staff-card {
          position: relative;
          min-width: 0;
          height: 390px;
          overflow: hidden;
          padding: 0;
          text-align: left;
          border: 1px solid #263b4b;
          border-radius: 19px;
          background: #101e2d;
          cursor: pointer;
          isolation: isolate;
          transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
        }

        .staff-card:hover {
          transform: translateY(-8px);
          border-color: #a3f45b;
          box-shadow: 0 12px 38px #8ef04a20, 0 0 18px #a3f45b20;
        }

        .staff-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .6s ease;
        }

        .staff-card:hover .staff-photo {
          transform: scale(1.055);
        }

        .staff-placeholder {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #a3f45b;
          font-size: 85px;
          font-weight: 900;
          background: linear-gradient(145deg, #19354a, #0b1725);
        }

        .staff-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            #07132100 35%,
            #07132170 60%,
            #071321f5 100%
          );
        }

        .staff-info {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 26px 23px;
        }

        .staff-label {
          display: inline-block;
          margin-bottom: 12px;
          padding: 6px 10px;
          color: #a3f45b;
          border: 1px solid #a3f45b65;
          border-radius: 4px;
          background: #a3f45115;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .staff-name {
          margin: 0;
          color: #fff;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.15;
          text-shadow: 0 2px 12px #000;
        }

        .staff-divider {
          width: 43px;
          height: 3px;
          margin: 14px 0;
          border-radius: 5px;
          background: #a3f45b;
          box-shadow: 0 0 12px #a3f45b90;
        }

        .staff-role {
          margin: 0;
          color: #c7f99e;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
        }

        .staff-open {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 17px;
          color: #d7e4ef;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          opacity: .8;
        }

        .staff-arrow {
          color: #a3f45b;
          font-size: 22px;
          transition: transform .2s ease;
        }

        .staff-card:hover .staff-arrow {
          transform: translateX(5px);
        }

        .staff-footer {
          margin-top: 70px;
          padding-top: 25px;
          border-top: 1px solid #26394b;
          text-align: center;
          color: #8294a8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          overflow-y: auto;
          background: #020812e8;
          backdrop-filter: blur(12px);
        }

        .profile-modal {
          position: relative;
          width: 100%;
          max-width: 850px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 38px clamp(20px, 5vw, 45px);
          border: 1px solid #a3f45b70;
          border-radius: 22px;
          background: linear-gradient(145deg, #142638, #081321);
          box-shadow: 0 25px 90px #000b, 0 0 35px #a3f45b12;
        }

        .close-button {
          position: absolute;
          top: 15px;
          right: 17px;
          width: 40px;
          height: 40px;
          border: 1px solid #40576a;
          border-radius: 50%;
          background: #1b3043;
          color: white;
          font-size: 25px;
          cursor: pointer;
        }

        .profile-photo {
          width: 155px;
          height: 155px;
          margin: 0 auto 20px;
          overflow: hidden;
          border: 4px solid #a3f45b;
          border-radius: 50%;
          box-shadow: 0 0 25px #a3f45b30;
        }

        .profile-photo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .profile-heading {
          margin-bottom: 32px;
          text-align: center;
        }

        .profile-heading h2 {
          margin: 12px 0;
          font-size: clamp(26px, 5vw, 38px);
          font-weight: 900;
        }

        .profile-role {
          color: #baf58b;
          font-weight: 800;
          font-size: 17px;
        }

        .profile-section {
          margin-top: 27px;
        }

        .profile-section h3 {
          margin-bottom: 15px;
          color: #a3f45b;
          font-size: 19px;
        }

        .profile-description {
          color: #d0dce7;
          line-height: 1.85;
          white-space: pre-line;
        }

        .career-item {
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 17px;
          border: 1px solid #31495a;
          border-radius: 13px;
          background: #ffffff08;
        }

        .career-crest {
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          object-fit: contain;
        }

        .career-placeholder {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          border-radius: 12px;
          color: #a3f45b;
          background: #1e3548;
          font-size: 22px;
        }

        .career-club {
          color: white;
          font-size: 16px;
          font-weight: 900;
        }

        .career-role {
          margin-top: 5px;
          color: #c5d2de;
        }

        .career-period {
          margin-top: 5px;
          color: #a3f45b;
          font-size: 13px;
        }

        @media (max-width: 600px) {
          .staff-page {
            padding: 55px 16px 35px;
          }

          .staff-header {
            margin-bottom: 38px;
          }

          .staff-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .staff-card {
            height: 285px;
            border-radius: 13px;
          }

          .staff-info {
            padding: 15px 12px;
          }

          .staff-name {
            font-size: 17px;
          }

          .staff-role {
            font-size: 12px;
          }

          .staff-label {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .staff-open {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .profile-modal {
            padding: 35px 18px 25px;
          }
        }

        @media (max-width: 360px) {
          .staff-grid {
            grid-template-columns: 1fr;
          }

          .staff-card {
            height: 360px;
          }
        }
      `}</style>

      <section className="staff-container">
        <header className="staff-header">
          <p className="eyebrow">
            TRAIN Football · En busca de la excelencia
          </p>

          <h1 className="staff-title">
            NUESTRO <span>STAFF</span>
          </h1>

          <p className="staff-subtitle">
            Conocé a los profesionales que forman parte de TRAIN Football.
            Experiencia, conocimiento y compromiso al servicio del desarrollo
            del fútbol.
          </p>

          <div className="header-line" />
        </header>

        {cargando && (
          <p style={{ textAlign: "center", color: "#a3f45b" }}>
            Cargando equipo profesional...
          </p>
        )}

        {error && (
          <p role="alert" style={{ textAlign: "center", color: "#ff9999" }}>
            {error}
          </p>
        )}

        {!cargando && !error && integrantes.length === 0 && (
          <p style={{ textAlign: "center", color: "#aebdce" }}>
            Próximamente conocerás a nuestro equipo.
          </p>
        )}

        <div className="staff-grid">
          {integrantes.map((persona) => {
            const zoom = persona.foto_zoom ?? 1;
            const posicionX = persona.foto_x ?? 50;
            const posicionY = persona.foto_y ?? 50;

            return (
              <button
                key={persona.id}
                type="button"
                className="staff-card"
                onClick={() => setIntegranteSeleccionado(persona)}
                aria-label={`Ver perfil de ${persona.nombre}`}
              >
                {persona.foto_url ? (
                  <img
                    className="staff-photo"
                    src={persona.foto_url}
                    alt={`Foto de ${persona.nombre}`}
                    style={{
                      objectPosition: `${posicionX}% ${posicionY}%`,
                      transform: `scale(${zoom})`,
                    }}
                  />
                ) : (
                  <div className="staff-placeholder">
                    {persona.nombre.charAt(0)}
                  </div>
                )}

                <div className="staff-overlay" />

                <div className="staff-info">
                  <span className="staff-label">TRAIN FOOTBALL</span>
                  <h2 className="staff-name">{persona.nombre}</h2>
                  <div className="staff-divider" />
                  <p className="staff-role">{persona.cargo}</p>

                  <div className="staff-open">
                    <span>VER PERFIL PROFESIONAL</span>
                    <span className="staff-arrow">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <footer className="staff-footer">
          TRAIN FOOTBALL · 10 AÑOS FORMANDO Y CAPACITANDO
        </footer>
      </section>

      {integranteSeleccionado && (
        <div
          className="modal-backdrop"
          onClick={() => setIntegranteSeleccionado(null)}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="perfil-staff-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setIntegranteSeleccionado(null)}
              aria-label="Cerrar perfil"
            >
              ×
            </button>

            <div className="profile-heading">
              {integranteSeleccionado.foto_url && (
                <div className="profile-photo">
                  <img
                    src={integranteSeleccionado.foto_url}
                    alt={integranteSeleccionado.nombre}
                    style={{
                      objectPosition: `${
                        integranteSeleccionado.foto_x ?? 50
                      }% ${integranteSeleccionado.foto_y ?? 50}%`,
                      transform: `scale(${
                        integranteSeleccionado.foto_zoom ?? 1
                      })`,
                    }}
                  />
                </div>
              )}

              <p className="eyebrow">TRAIN FOOTBALL · STAFF PROFESIONAL</p>

              <h2 id="perfil-staff-titulo">
                {integranteSeleccionado.nombre}
              </h2>

              <p className="profile-role">
                {integranteSeleccionado.cargo}
              </p>
            </div>

            {integranteSeleccionado.descripcion && (
              <div className="profile-section">
                <h3>Perfil profesional</h3>
                <p className="profile-description">
                  {integranteSeleccionado.descripcion}
                </p>
              </div>
            )}

            <div className="profile-section">
              <h3>Trayectoria profesional</h3>

              {integranteSeleccionado.trayectoria?.filter(
                (item) => item.club || item.cargo || item.periodo
              ).length ? (
                <div style={{ display: "grid", gap: 13 }}>
                  {integranteSeleccionado.trayectoria
                    .filter(
                      (item) => item.club || item.cargo || item.periodo
                    )
                    .map((item, indice) => (
                      <div
                        key={`${item.club}-${indice}`}
                        className="career-item"
                      >
                        {item.escudo_url ? (
                          <img
                            className="career-crest"
                            src={item.escudo_url}
                            alt={`Escudo de ${item.club}`}
                          />
                        ) : (
                          <div className="career-placeholder">⚽</div>
                        )}

                        <div>
                          <p className="career-club">{item.club}</p>

                          {item.cargo && (
                            <p className="career-role">{item.cargo}</p>
                          )}

                          {item.periodo && (
                            <p className="career-period">{item.periodo}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="profile-description">
                  La trayectoria profesional de este integrante se actualizará
                  próximamente.
                </p>
              )}
            </div>

            <p
              style={{
                color: "#8294a8",
                textAlign: "center",
                fontSize: 10,
                letterSpacing: 2,
                marginTop: 35,
              }}
            >
              TRAIN FOOTBALL · 10 AÑOS FORMANDO Y CAPACITANDO
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
