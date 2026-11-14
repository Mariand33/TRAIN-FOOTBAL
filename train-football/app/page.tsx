"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const base = "/images/train-fotos/";

const cursos = [
  { nombre: "Organización semanal del entrenamiento de fútbol competitivo", imagen: "webinar-organizacion-semanal.jpg", url: "https://capacitacionescads.com/cursos/entrenamiento-futbol-competitivo-organizacion" },
  { nombre: "Preparación física contextualizada al fútbol", imagen: "webinar-preparacion-fisica.jpg", url: "https://capacitacionescads.com/cursos/la-preparacion-fisica-contextualizada-al-futbol" },
  { nombre: "Principios tácticos defensivos del fútbol", imagen: "webinar-principios-defensivos.jpg", url: "https://capacitacionescads.com/cursos/principios-tacticos-futbol" },
  { nombre: "Modelo de planificación en el fútbol infanto-juvenil", imagen: "webinar-planificacion-infantil.jpg", url: "https://capacitacionescads.com/cursos/planificacion-futbol-infantiles-juveniles" },
  { nombre: "La preparación integral del futbolista", imagen: "webinar-preparacion-integral.jpg", url: "https://capacitacionescads.com/cursos/futbol-entrenamiento-seminario-fisico-tecnica-tactica" },
  { nombre: "Modelos de juego en el fútbol", imagen: "webinar-modelos-de-juego.jpg", url: "https://capacitacionescads.com/cursos/modelos-juego-futbol-sebastian-lopez" },
];

const fundadores = [
  { nombre: "Sebastián López", cargo: "Director técnico · Miembro fundador", foto: "sebastian-lopez.jpg" },
  { nombre: "Fernando López", cargo: "Preparador físico · Miembro fundador", foto: "fernando-lopez.jpg" },
];

const staff = [
  { nombre: "Sebastián del Río", especialidad: "Preparación física · Área preventiva", foto: "Seba del Rio 2.jpg" },
  { nombre: "José Campofiloni", especialidad: "Preparación física contextualizada", foto: "jose-campofiloni-2.jpg" },
  { nombre: "Lucas Ochandorena", especialidad: "Dirección técnica · Área técnico-táctica", foto: "lucas-ochandorena-1.jpeg" },
  { nombre: "Ariel Bosotina", especialidad: "Preparación física · Área de fútbol femenino", foto: "Ariel 1.jpg" },
  { nombre: "Federico Ochoa", especialidad: "Preparación física · Área de la fuerza", foto: "fede ochoa.jpg" },
  { nombre: "Mariano Minvielle", especialidad: "Profesor · Área de fútbol formativo e infantojuvenil", foto: "mariano-minvielle-1.jpg" },
];

const campusStaff = [
  { nombre: "Sebastián López", rol: "Director técnico" },
  { nombre: "Fernando López", rol: "Preparador físico" },
  { nombre: "Emanuel González", rol: "Preparador físico" },
  { nombre: "Gerardo Pagotto", rol: "Nutricionista" },
];



const entrenamientos = [
  "AF6A2095.JPG", "IMG-20190610-WA0003.jpg", "IMG-20190610-WA0004.jpg",
  "IMG-20190610-WA0005.jpg", "IMG-20190610-WA0034.jpg",
  "IMG-20190722-WA0088.jpg", "IMG-20190722-WA0089.jpg",
  "IMG-20190722-WA0090.jpg", "IMG-20190722-WA0091.jpg",
];

const novedades = [
  { categoria: "CAMPUS 2026", titulo: "Cuatro jornadas de formación en Bahía Blanca", texto: "Del 7 al 10 de diciembre. Categorías 2011, 2012, 2013 y 2014.", destino: "#campus" },
  { categoria: "CAPACITACIÓN", titulo: "Jornada teórico-práctica", texto: "Un espacio de actualización para entrenadores y profesionales del fútbol.", destino: "#jornada" },
  { categoria: "FORMACIÓN", titulo: "Webinars de Formación", texto: "Propuestas de capacitación online para seguir creciendo profesionalmente.", destino: "#cursos" },
];

export default function Home() {
 const [integrantes, setIntegrantes] = useState<any[]>([]);
 const [sponsorsDB, setSponsorsDB] = useState<any[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

useEffect(() => {
  async function cargarIntegrantes() {
    const { data, error } = await supabase
      .from("staff_train_football")
      .select("id, nombre, cargo, descripcion, foto_url, orden, foto_zoom, foto_x, foto_y")
      .order("orden", { ascending: true });

    if (!error) setIntegrantes(data ?? []);
  }

  cargarIntegrantes();

  async function cargarSponsors() {
    const { data, error } = await supabase
      .from("sponsors_train_football")
      .select("id, nombre, logo_url, orden, url")
      .eq("activo", true)
      .order("orden", { ascending: true });

    if (!error) setSponsorsDB(data ?? []);
    else console.error("Error al cargar auspiciantes:", error.message);
  }

  cargarSponsors();
}, []);

const fundadoresDB = integrantes.filter(p =>
  p.cargo.toLowerCase().includes("fundador")
);

const staffDB = integrantes.filter(p =>
  !p.cargo.toLowerCase().includes("fundador")
); 
return (
    <main className="min-h-screen overflow-hidden bg-[#080d1b] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d1b]/95 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
    <a href="#inicio" aria-label="TRAIN Football, inicio">
      <img src="/images/02-logo-blanco-circular.png" alt="TRAIN Football" className="h-14 w-14 rounded-full object-contain" />
    </a>

    <nav className="hidden items-center gap-5 text-sm text-gray-300 lg:flex">
      <a href="/capacitacion" className="rounded-full bg-amber-400 px-4 py-2 font-bold text-[#080d1b]">Jornada Presencial</a>
      <a href="#nosotros">Nosotros</a>
      <a href="#staff">Staff</a>
      <a href="#campus">Campus</a>
      <a href="#jornada">Jornada Presencial</a>
      <a href="#cursos">Cursos</a>
      <a href="/materiales">Materiales</a>
      <a href="/animaciones">Animaciones</a>
      <a href="#novedades">Novedades</a>
      <a href="#contacto">Contacto</a>
    </nav>

    <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer"
      className="hidden rounded-full bg-violet-600 px-4 py-3 text-sm font-bold lg:block">Contactanos</a>

    <button type="button" onClick={() => setMenuAbierto(!menuAbierto)}
      aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={menuAbierto}
      className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-amber-300/50 text-amber-300 lg:hidden">
      <span className="h-0.5 w-6 bg-current" />
      <span className="h-0.5 w-6 bg-current" />
      <span className="h-0.5 w-6 bg-current" />
    </button>
  </div>

  {menuAbierto && (
    <nav className="border-t border-white/10 bg-[#080d1b] px-6 py-5 lg:hidden">
      <div className="flex flex-col gap-4 text-sm font-semibold text-white">
        {[
          ["Jornada Presencial", "/capacitacion"],
          ["Nosotros", "#nosotros"],
          ["Staff", "#staff"],
          ["Campus", "#campus"],
          ["Jornada Presencial", "#jornada"],
          ["Cursos", "#cursos"],
          ["Materiales", "/materiales"],
          ["Animaciones", "/animaciones"],
          ["Novedades", "#novedades"],
          ["Contacto", "#contacto"],
          ["WhatsApp", "https://wa.link/qb0ao7"],
        ].map(([nombre, enlace]) => (
          <a key={nombre} href={enlace} onClick={() => setMenuAbierto(false)}
            className="border-b border-white/10 py-2 hover:text-amber-300">{nombre}</a>
        ))}
      </div>
    </nav>
  )}
</header>

<section className="relative isolate overflow-hidden border-b border-amber-300/40 bg-gradient-to-r from-[#102d29] via-[#0b1928] to-[#080d1b]">
  <style>{`
    @keyframes ballTravel {
      0% { transform: translate3d(-12vw, -50%, 0) rotate(0deg); }
      100% { transform: translate3d(66vw, -50%, 0) rotate(900deg); }
    }
    @keyframes lightTravel {
      0% { transform: translateX(-120%); opacity: 0; }
      20% { opacity: .7; }
      80% { opacity: .7; }
      100% { transform: translateX(120vw); opacity: 0; }
    }
    @keyframes softGlow {
      0%, 100% { opacity: .18; transform: scale(.9); }
      50% { opacity: .48; transform: scale(1.12); }
    }
    @keyframes cinematicZoom {
      from { transform: scale(1); }
      to { transform: scale(1.09); }
    }
    @keyframes contentReveal {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes emblemFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    .hero-bg-cinematic { animation: cinematicZoom 24s ease-in-out infinite alternate; }
    .hero-content-enter { animation: contentReveal 1.2s ease-out both; }
    .hero-emblem-float { animation: emblemFloat 6s ease-in-out infinite; }
    .football-ball {
      animation: ballTravel 5s ease-in-out infinite alternate;
    }
    .football-light {
      animation: lightTravel 7s ease-in-out infinite;
    }
    .football-glow {
      animation: softGlow 4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .football-ball, .football-light, .football-glow,
      .hero-bg-cinematic, .hero-content-enter, .hero-emblem-float {
        animation: none !important;
        transform: none !important;
        opacity: 1 !important;
      }
    }
  `}</style>

  <div className="football-glow pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
  <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[46%] md:block">
    <img
      src="/images/botin-control-transparente.webp"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-contain opacity-100"
    />
  </div>

  <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 px-6 py-10 text-center md:flex-row md:px-12 md:text-left">
    <div className="max-w-3xl">
      <span className="inline-flex rounded-full bg-amber-300 px-4 py-2 text-xs font-black tracking-widest text-[#080d1b] shadow-lg shadow-amber-300/20">
        DICIEMBRE 2026 · INSCRIPCIONES ABIERTAS
      </span>
      <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
        JORNADA PRESENCIAL
        <span className="block text-amber-300">TRAIN Football</span>
      </h2>
      <p className="mt-4 text-base leading-7 text-gray-200 md:text-lg">
        Formación, actualización y herramientas para entrenadores y profesionales del fútbol.
      </p>
      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row md:items-center">
        <img src="/images/escudo-banco-provincia.png" alt="Club Atlético Banco Provincia" className="h-16 w-16 rounded-lg bg-white p-1.5 object-contain shadow-lg" />
        <p className="text-sm font-bold leading-6 text-white">
          Club Atlético Banco Provincia<br />
          <span className="text-amber-300">Zonal Bahía Blanca</span>
        </p>
      </div>
    </div>
    <div className="w-full md:hidden">
      <img src="/images/botin-control-transparente.webp" alt="" aria-hidden="true" className="h-40 w-full object-contain opacity-90" />
    </div>
    <a href="/capacitacion"
      className="shrink-0 rounded-full bg-amber-300 px-8 py-5 text-base font-black text-[#080d1b] shadow-lg shadow-amber-300/20 transition duration-300 hover:scale-105 hover:bg-amber-200 hover:shadow-amber-300/40">
      INSCRIPCIONES ABIERTAS →
    </a>
  </div>
</section>

      <section id="inicio" className="relative isolate overflow-hidden border-b border-amber-300/20 bg-[#080d1b]">
        <img src={`${base}Grupo%20de%20entrenamiento.png`} alt="Entrenamiento de TRAIN Football" className="hero-bg-cinematic absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080d1b] via-[#080d1b]/90 to-[#080d1b]/35" />
        <div className="hero-content-enter mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[1fr_260px] md:px-12">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 border-y border-amber-300/40 py-3"><span className="text-amber-300">✦</span><p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200 md:text-sm">2016 — 2026 · Diez años de trayectoria</p></div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-gray-200">Formación · Capacitación · Metodología</p>
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight md:text-7xl">Una década<br /><span className="text-amber-300">formando fútbol.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-200">Diez años de trabajo en la formación futbolística, la capacitación profesional y el desarrollo de una comprensión integral del juego.</p>
            <div className="mt-9 flex flex-wrap gap-4"><a href="#jornada" className="rounded-full bg-amber-300 px-6 py-4 font-extrabold text-[#080d1b] hover:bg-amber-200">Jornada Presencial</a><a href="#campus" className="rounded-full border border-white/50 px-6 py-4 font-bold hover:bg-white/10">Inscripción al Campus 2026</a></div>
          </div>
          <div className="flex flex-col items-center justify-center"><img src={`${base}10%20a%C3%B1os%20transparentes.png`} alt="Diez años de TRAIN Football" className="hero-emblem-float w-52 object-contain drop-shadow-2xl md:w-64" /><p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-200">En búsqueda de la excelencia</p></div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-[#0d1426]"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5"><p className="text-sm font-bold tracking-wide text-gray-300">DIEZ AÑOS DE FORMACIÓN · 2016—2026</p><img src="/images/04-logo-azul-circular.png" alt="Emblema TRAIN Football" className="h-16 w-16 rounded-full object-contain" /></div></div>

      <section id="nosotros" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Nuestra identidad</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Formación con una mirada integral del juego.</h2></div><div className="text-lg leading-8 text-gray-300"><p>Desde 2016, TRAIN Football trabaja en la formación y capacitación futbolística, promoviendo el aprendizaje, la planificación y la comprensión integral del juego.</p><p className="mt-5">Su propuesta integra contenidos técnicos, tácticos y físicos contextualizados a las necesidades del fútbol.</p></div></div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">{[["Metodología","Comprender el juego y planificar el entrenamiento."],["Formación","Compartir conocimientos y herramientas para jugadores y entrenadores."],["Desarrollo","Integrar técnica, táctica y preparación física."]].map(([titulo,texto])=><article key={titulo} className="border-t border-violet-400/70 pt-5"><h3 className="text-2xl font-bold">{titulo}</h3><p className="mt-3 leading-7 text-gray-400">{texto}</p></article>)}</div>
      </section>

      <section id="video" className="border-y border-white/10 bg-[#0d1426] py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[0.75fr_1.25fr] md:px-12">
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Conocé nuestra historia</p><h2 className="mt-4 text-4xl font-black md:text-5xl">¿Quiénes somos?</h2><p className="mt-5 text-lg leading-8 text-gray-300">Te invitamos a conocer TRAIN Football, nuestra identidad y la pasión que nos impulsa a seguir creciendo junto al fútbol.</p><a href="https://www.youtube.com/watch?v=QrCShh19wao" target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full border border-amber-300/60 px-6 py-3 font-bold text-amber-200 hover:bg-amber-300 hover:text-[#080d1b]">Ver en YouTube ↗</a></div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"><div className="aspect-video w-full"><iframe className="h-full w-full" src="https://www.youtube-nocookie.com/embed/QrCShh19wao" title="TRAIN Football — ¿Quiénes somos?" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div>
      </div></section>

      <section id="staff" className="bg-[#10182a] py-20"><div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Las personas detrás del proyecto</p><h2 className="mt-3 text-4xl font-black md:text-5xl">Staff TRAIN Football</h2><p className="mt-4 max-w-2xl leading-7 text-gray-400">Un equipo interdisciplinario comprometido con la formación, el desarrollo y la evolución del fútbol.</p>
        <div className="mt-12">
          <h3 className="text-2xl font-black text-amber-300 md:text-3xl">Fundadores y creadores</h3>
          <p className="mt-2 text-gray-400">Quienes dieron origen e impulsan el proyecto TRAIN Football.</p>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {fundadoresDB.map((persona) => (
              <article key={persona.id} className="flex flex-col items-center rounded-2xl border border-amber-300/40 bg-[#080d1b] px-6 py-7 text-center">
                {persona.foto_url && <div className="h-36 w-36 overflow-hidden rounded-full border-2 border-amber-300">
                  <img src={persona.foto_url} alt={persona.nombre} className="h-full w-full object-cover" style={{ objectPosition: `${persona.foto_x ?? 50}% ${persona.foto_y ?? 50}%`, transform: `scale(${persona.foto_zoom ?? 1})` }} />
                </div>}
                <h4 className="mt-5 text-xl font-bold">{persona.nombre}</h4>
                <p className="mt-2 text-sm text-amber-200">{persona.cargo}</p>
                {persona.descripcion && <p className="mt-2 text-sm text-gray-400">{persona.descripcion}</p>}
              </article>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-2xl font-black md:text-3xl">Staff permanente</h3>
          <p className="mt-2 text-gray-400">Profesionales que conforman el equipo TRAIN Football.</p>
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {staffDB.map((persona) => (
              <article key={persona.id} className="flex flex-col items-center rounded-2xl border border-white/10 bg-[#080d1b] px-4 py-6 text-center">
                {persona.foto_url && <div className="h-36 w-36 overflow-hidden rounded-full border-2 border-violet-400/60">
                  <img src={persona.foto_url} alt={persona.nombre} className="h-full w-full object-cover" style={{ objectPosition: `${persona.foto_x ?? 50}% ${persona.foto_y ?? 50}%`, transform: `scale(${persona.foto_zoom ?? 1})` }} />
                </div>}
                <h4 className="mt-4 text-lg font-bold">{persona.nombre}</h4>
                <p className="mt-2 text-sm text-gray-400">{persona.cargo}</p>
                {persona.descripcion && <p className="mt-2 text-sm text-gray-400">{persona.descripcion}</p>}
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 text-center"><a href="/staff" className="inline-flex rounded-full bg-amber-300 px-6 py-3 font-bold text-[#080d1b] hover:bg-amber-200">Conocé más sobre nuestro equipo →</a></div>
      </div></section>

      <section id="campus" className="mx-auto max-w-7xl px-6 py-20 md:px-12"><div className="grid gap-10 md:grid-cols-2 md:items-center">
        <img src="/images/03-campus-2026-circular.png" alt="Campus de tecnificación TRAIN Football 2026" className="mx-auto h-72 w-72 rounded-full object-contain" loading="lazy" />
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Experiencia de formación</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Campus de tecnificación 2026</h2><p className="mt-5 text-lg leading-8 text-gray-300">Cuatro jornadas de trabajo intensivo destinadas a jugadores de las categorías 2011, 2012, 2013 y 2014.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#10182a] p-6">
            <h3 className="text-xl font-bold text-white">¿De qué se trata un Campus de Tecnificación?</h3>
            <p className="mt-4 leading-7 text-gray-300">Es un espacio especialmente diseñado para que los niños desarrollen y mejoren sus habilidades deportivas en el fútbol. Los participantes reciben entrenamiento dirigido por profesionales, enfocado en los aspectos técnicos, tácticos y condicionales, con el juego como primer principio.</p>
            <p className="mt-4 leading-7 text-gray-300">También se trabajan valores fundamentales para su formación: el trabajo en equipo, la disciplina y la responsabilidad.</p>
            <p className="mt-4 font-semibold leading-7 text-amber-300">Celebramos 10 años de formación y capacitación con un evento de especial significado.</p>
          </div><p className="mt-6 font-bold text-amber-300">7 al 10 de diciembre de 2026</p><div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img src="/images/escudo-banco-provincia.png" alt="Escudo del Club Atlético Banco Provincia" className="w-32 rounded-xl bg-white p-2 object-contain shadow-lg" />
          <p className="text-base font-bold leading-7 text-white">Club Atlético Banco Provincia<br />Zonal Bahía Blanca</p>
        </div><ul className="mt-7 space-y-3 text-gray-300"><li>— Trabajo técnico-táctico</li><li>— Preparación física contextualizada</li><li>— Prevención y nutrición</li><li>— Análisis de video</li></ul><a href="https://docs.google.com/forms/d/e/1FAIpQLSfkzVC-qGFblfWFWS2CqaOGHDdlGvkTyuaQkDGQ8en5OCq7vQ/viewform?pli=1" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-amber-300 px-7 py-4 font-extrabold text-[#080d1b] hover:bg-amber-200">Inscribirme al campus ↗</a></div>
      </div>
      <div className="mt-14 border-t border-white/10 pt-10"><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Equipo a cargo</p><h3 className="mt-3 text-2xl font-black md:text-3xl">Profesionales del Campus</h3><div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">{campusStaff.map(persona=><article key={persona.nombre} className="border-l-2 border-amber-300/70 bg-[#10182a] p-5"><h4 className="font-bold">{persona.nombre}</h4><p className="mt-2 text-sm text-gray-400">{persona.rol}</p></article>)}</div></div>
      </section>

      <section id="jornada" className="border-y border-white/10 bg-[#10182a] py-20"><div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_0.8fr] md:items-center md:px-12">
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Formación para entrenadores</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Jornada teórico-práctica</h2><p className="mt-5 text-lg leading-8 text-gray-300">Un espacio de capacitación para profundizar en la metodología de entrenamiento, el modelo de juego y la preparación del futbolista.</p><p className="mt-6 font-bold text-amber-300">11 de diciembre de 2026 · Bahía Blanca</p>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <img src="/images/escudo-banco-provincia.png" alt="Escudo del Club Atlético Banco Provincia" className="w-32 rounded-xl bg-white p-2 object-contain shadow-lg" />
            <p className="text-base font-bold leading-7 text-white">Club Atlético Banco Provincia<br />Zonal Bahía Blanca</p>
          </div><a href="https://wa.link/qb0ao7" className="mt-7 inline-flex rounded-full border border-white/30 px-6 py-3 font-bold hover:bg-white/10">Consultar por la jornada</a>
          <a href="/capacitacion" className="mt-4 inline-flex rounded-full bg-amber-400 px-8 py-4 font-black text-[#080d1b] transition hover:bg-amber-300">
            INSCRIBIRME A LA CAPACITACIÓN
          </a></div>
        <img src="/images/05-capacitacion-circular.png" alt="Capacitaciones TRAIN Football" className="mx-auto h-64 w-64 rounded-full object-contain" loading="lazy" />
      </div></section>


      <section id="organiza-jornada" className="border-b border-amber-300/20 bg-gradient-to-br from-[#151d38] via-[#10182a] to-[#080d1b] px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">TRAIN Football · Capacitaciones</p>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white md:text-5xl">¿Querés organizar una jornada de capacitación en <span className="text-amber-300">tu ciudad?</span></h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">Llevamos nuestra propuesta de formación teórica-práctica a tu club, institución o localidad.</p>
          <p className="mx-auto mt-4 max-w-3xl leading-8 text-gray-300">Diseñamos jornadas de capacitación adaptadas a las necesidades de cada espacio, con profesionales, contenidos específicos y experiencias vinculadas al fútbol.</p>
          <h3 className="mt-8 text-xl font-bold text-amber-300 md:text-2xl">Organizá tu jornada con TRAIN Football.</h3>
          <p className="mt-3 text-gray-300">Consultanos y diseñemos juntos una propuesta para tu institución.</p>
          <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-amber-300 px-8 py-4 font-black text-[#080d1b] shadow-lg shadow-amber-300/20 transition hover:scale-105 hover:bg-amber-200">Quiero organizar una jornada ↗</a>
        </div>
      </section>

      <section id="curso-gratuito" className="border-y border-emerald-400/30 bg-gradient-to-br from-[#102b29] to-[#080d1b] px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-emerald-400 px-5 py-2 text-sm font-black uppercase tracking-wider text-[#06251e]">
              100% GRATUITO
            </span>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
              OPORTUNIDAD DE FORMACIÓN · CADS
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
              Fútbol femenino: entrenamiento y estadística
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Una propuesta de capacitación gratuita para seguir aprendiendo y creciendo en el fútbol.
            </p>
            <a
              href="https://capacitacionescads.com/cursos/futbol-femenino-gratuito-entrenamiento-estadistica"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-emerald-400 px-8 py-4 font-black text-[#06251e] transition hover:bg-emerald-300"
            >
              ACCEDER AL CURSO GRATUITO ↗
            </a>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-300/30 bg-white/5 p-8 text-center">
            <span className="text-6xl font-black text-emerald-300">0$</span>
            <p className="mt-3 text-xl font-black text-white">Inscripción gratuita</p>
            <p className="mt-2 text-sm text-gray-300">Formación online · CADS Capacitaciones</p>
          </div>
        </div>
      </section>

<section id="cursos" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
  <div className="mb-8 flex justify-center">
    <img src="/images/logo-cads.jpeg" alt="CADS Capacitaciones" className="h-auto w-36 rounded-xl object-contain md:w-40" />
  </div>

  <div className="mb-12 text-center">
    <a href="https://capacitacionescads.com/cursos" target="_blank" rel="noreferrer"
      className="inline-flex rounded-full bg-emerald-500 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-400">
      CONOCÉ TODAS LAS PROPUESTAS DE CADS ↗
    </a>
  </div>

  <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Formación continua</p>
  <h2 className="mt-3 text-4xl font-black md:text-5xl">Webinars de Formación</h2>
  <p className="mt-5 max-w-2xl leading-7 text-gray-400">Propuestas online de formación profesional. Elegí el webinar y accedé a su página oficial. Modalidad asincrónica.</p>

  <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
    {cursos.map((curso, i) => (
      <a key={curso.url} href={curso.url} target="_blank" rel="noreferrer"
        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10182a] transition duration-300 hover:-translate-y-2 hover:border-emerald-400/60 hover:shadow-xl">
        <div className="aspect-square overflow-hidden bg-[#080d1b]">
          <img src={`/images/${curso.imagen}`} alt={curso.nombre}
            loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">WEBINAR · 0{i + 1}</p>
          <h3 className="mt-3 min-h-16 text-lg font-bold leading-snug text-white">{curso.nombre}</h3>
          <p className="mt-4 font-bold text-violet-300 group-hover:text-violet-200">Ver propuesta y acceder ↗</p>
        </div>
      </a>
    ))}
  </div>
</section>

      <section id="novedades" className="relative overflow-hidden border-y border-violet-400/20 bg-[#080d1b] py-24">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Actualidad TRAIN Football</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">Novedades<span className="text-violet-400">.</span></h2>
              <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
            </div>
            <p className="max-w-md text-sm leading-6 text-gray-400">Formación, actualidad y nuevas oportunidades para seguir creciendo en el fútbol.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {novedades.map((item, i) => (
              <article key={item.titulo} className="group relative flex flex-col overflow-hidden rounded-2xl border border-violet-400/20 bg-[#10182a]/90 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/70 hover:shadow-[0_0_30px_rgba(34,211,238,0.13)]">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-300 to-violet-500 opacity-70 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{item.categoria}</p>
                  <span className="text-2xl font-black text-white/10 transition-colors group-hover:text-cyan-300/50">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-black leading-snug text-white transition-colors group-hover:text-cyan-200">{item.titulo}</h3>
                <p className="mt-4 flex-1 leading-7 text-gray-400">{item.texto}</p>
                <a href={item.destino} className="mt-8 inline-flex items-center gap-2 font-bold text-violet-300 transition-all hover:gap-3 hover:text-cyan-200">Conocer más <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080d1b] py-16"><div className="mx-auto max-w-7xl px-6 md:px-12"><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Nuestro trabajo</p><h2 className="mt-3 text-3xl font-black md:text-4xl">El fútbol, en el campo</h2><p className="mt-4 max-w-lg text-gray-400">Entrenamientos y experiencias de formación de TRAIN Football.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{entrenamientos.map((foto,i)=><img key={foto} src={`${base}${encodeURIComponent(foto)}`} alt={`Actividad de entrenamiento TRAIN Football ${i+1}`} loading="lazy" className={`w-full object-cover ${i===0?"aspect-[4/5] sm:row-span-2 sm:h-full":"aspect-[4/3]"}`} />)}</div></div></section>

      <section id="sponsors" aria-label="Sponsors históricos y auspiciantes de TRAIN Football" className="border-y border-white/10 bg-[#10182a] py-16">
  <div className="mx-auto max-w-7xl px-5 md:px-10">

    <div className="text-center">
      <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">2016 — 2026 · UNA HISTORIA COMPARTIDA</p>
      <h2 className="mt-3 text-3xl font-black md:text-5xl">10 años con nosotros</h2>
      <p className="mx-auto mt-4 max-w-2xl text-gray-400">
        Gracias por acompañar, confiar y ser parte del crecimiento de TRAIN Football.
      </p>
    </div>

    <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
      {sponsorsDB.filter(sponsor => [4, 12].includes(Number(sponsor.orden))).map(sponsor => (
        <article key={sponsor.id} className="flex flex-col items-center rounded-2xl border border-amber-300/50 bg-[#080d1b] p-5 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-amber-300">
          <a href={sponsor.url || undefined} target={sponsor.url ? "_blank" : undefined} rel={sponsor.url ? "noopener noreferrer" : undefined} className="flex w-full flex-col items-center">
          <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
            {sponsor.logo_url && (
              <img src={sponsor.logo_url} alt={sponsor.nombre} className="h-full w-full object-contain" />
            )}
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-amber-300">Sponsor histórico</p>
          <h3 className="mt-2 text-xl font-black text-white">{sponsor.nombre}</h3>
          <p className="mt-2 text-sm font-semibold text-gray-300">10 años acompañando a TRAIN Football</p>
          <span className="mt-4 rounded-full border border-amber-300/40 px-4 py-1 text-xs font-bold text-amber-200">2016 — 2026</span>
          {sponsor.url && <span className="mt-4 inline-flex rounded-full bg-amber-400 px-5 py-2 text-xs font-black uppercase tracking-wider text-[#080d1b] transition hover:scale-105 hover:bg-white">VISITAR SPONSOR ↗</span>}
          </a>
        </article>
      ))}
    </div>

    <div className="mt-16 text-center">
      <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">NOS ACOMPAÑAN</p>
      <p className="mt-3 text-sm text-gray-400">Gracias a todas las empresas y personas que apoyan nuestro proyecto.</p>
    </div>

    {sponsorsDB.filter(sponsor => ![4, 12].includes(Number(sponsor.orden))).length > 0 && (
      <div className="relative mt-9 overflow-hidden">
        <div className="sponsors-track flex w-max">
          {[0, 1].map(grupo => (
            <div key={grupo} className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={grupo === 1}>
              {sponsorsDB.filter(sponsor => ![4, 12].includes(Number(sponsor.orden))).map(sponsor => (
                <div key={`${grupo}-${sponsor.id}`} className="flex h-32 w-44 shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-white p-2 transition duration-300 hover:border-amber-300/60 sm:w-52">
                  {sponsor.logo_url && (
                    <a href={sponsor.url || undefined} target={sponsor.url ? "_blank" : undefined} rel={sponsor.url ? "noopener noreferrer" : undefined} className="flex min-h-0 flex-1 w-full items-center justify-center">
                      <img src={sponsor.logo_url} alt={grupo === 0 ? sponsor.nombre : ""} loading="lazy" className="h-full w-full object-contain" />
                    </a>
                  )}
                  {sponsor.url && <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#080d1b] transition hover:bg-amber-300">VISITAR ↗</a>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  <style jsx>{`
    .sponsors-track {
      animation: sponsors-scroll 38s linear infinite;
    }
    .sponsors-track:hover {
      animation-play-state: paused;
    }
    @keyframes sponsors-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .sponsors-track { animation: none; }
    }
  `}</style>
</section>

<footer id="contacto" className="border-t border-white/10 bg-[#050914]"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-center md:px-12"><div><img src="/images/02-logo-blanco-circular.png" alt="TRAIN Football" className="h-14 w-14 rounded-full object-contain" /><p className="mt-4 text-sm text-gray-400">Formación, capacitación y desarrollo futbolístico.</p><p className="mt-2 text-xs text-gray-500">Diez años · 2016—2026</p></div><div className="flex flex-wrap gap-6 text-sm text-gray-300"><a href="https://www.instagram.com/train_football/" target="_blank" rel="noreferrer">Instagram</a><a href="https://youtube.com/@trainfootball7580" target="_blank" rel="noreferrer">YouTube</a><a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer">WhatsApp</a></div></div><p className="border-t border-white/10 px-6 py-5 text-center text-xs text-gray-500">© 2026 TRAIN Football. Todos los derechos reservados.</p></footer>
      <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer" aria-label="Contactar a TRAIN Football por WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-lg hover:bg-green-400">WhatsApp ↗</a>

      <section id="inscripcion-capacitacion" className="bg-[#10182a] px-6 py-14 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Formación profesional
        </p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">
          Capacitate con TRAIN Football
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Inscribite a nuestras propuestas de capacitación y seguí creciendo en el fútbol.
        </p>
        <a href="/capacitacion"
          className="mt-7 inline-flex rounded-full bg-amber-400 px-8 py-4 font-black text-[#080d1b] transition hover:bg-amber-300">
          CAPACITACIÓN · INSCRIBIRME
        </a>
      </section>
    </main>
  );
}
