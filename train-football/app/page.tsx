"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const base = "/images/train-fotos/";

const cursos = [
  { nombre: "Modelos de juego en fútbol", url: "https://capacitacionescads.com/cursos/modelos-juego-futbol-sebastian-lopez" },
  { nombre: "Planificación en fútbol infantil y juvenil", url: "https://capacitacionescads.com/cursos/planificacion-futbol-infantiles-juveniles" },
  { nombre: "Principios tácticos del fútbol", url: "https://capacitacionescads.com/cursos/principios-tacticos-futbol" },
  { nombre: "Entrenamiento de fútbol competitivo", url: "https://capacitacionescads.com/cursos/entrenamiento-futbol-competitivo-organizacion" },
  { nombre: "Preparación física contextualizada al fútbol", url: "https://capacitacionescads.com/cursos/la-preparacion-fisica-contextualizada-al-futbol" },
  { nombre: "La preparación integral del futbolista", url: "https://capacitacionescads.com/cursos/futbol-entrenamiento-seminario-fisico-tecnica-tactica" },
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
  { categoria: "FORMACIÓN", titulo: "Cursos y webinars CADS", texto: "Propuestas de capacitación online para seguir creciendo profesionalmente.", destino: "#cursos" },
];

export default function Home() {
 const [integrantes, setIntegrantes] = useState<any[]>([]);
 const [sponsorsDB, setSponsorsDB] = useState<any[]>([]);

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
      .select("id, nombre, logo_url, orden")
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
          <a href="#inicio" aria-label="Train Footbal, inicio"><img src="/images/02-logo-blanco-circular.png" alt="Train Footbal" className="h-14 w-14 rounded-full object-contain" /></a>
          <nav className="hidden flex-wrap items-center gap-5 text-sm text-gray-300 lg:flex">
            <a href="#nosotros" className="hover:text-amber-300">Nosotros</a>
            <a href="#staff" className="hover:text-amber-300">Staff</a>
            <a href="#campus" className="hover:text-amber-300">Campus</a>
            <a href="#jornada" className="hover:text-amber-300">Capacitaciones</a>
            <a href="#cursos" className="hover:text-amber-300">Cursos</a>
            <a href="#novedades" className="hover:text-amber-300">Novedades</a>
            <a href="#contacto" className="hover:text-amber-300">Contacto</a>
          </nav>
          <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-violet-600 px-4 py-3 text-sm font-bold hover:bg-violet-500">Contactanos</a>
        </div>
      </header>

      <section id="inicio" className="relative isolate overflow-hidden border-b border-amber-300/20 bg-[#080d1b]">
        <img src={`${base}Grupo%20de%20entrenamiento.png`} alt="Entrenamiento de Train Footbal" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080d1b] via-[#080d1b]/90 to-[#080d1b]/35" />
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[1fr_260px] md:px-12">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 border-y border-amber-300/40 py-3"><span className="text-amber-300">✦</span><p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200 md:text-sm">2016 — 2026 · Diez años de trayectoria</p></div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-gray-200">Formación · Capacitación · Metodología</p>
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight md:text-7xl">Una década<br /><span className="text-amber-300">formando fútbol.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-200">Diez años de trabajo en la formación futbolística, la capacitación profesional y el desarrollo de una comprensión integral del juego.</p>
            <div className="mt-9 flex flex-wrap gap-4"><a href="#jornada" className="rounded-full bg-amber-300 px-6 py-4 font-extrabold text-[#080d1b] hover:bg-amber-200">Capacitaciones</a><a href="#campus" className="rounded-full border border-white/50 px-6 py-4 font-bold hover:bg-white/10">Inscripción al Campus 2026</a></div>
          </div>
          <div className="flex flex-col items-center justify-center"><img src={`${base}10%20a%C3%B1os%20transparentes.png`} alt="Diez años de Train Footbal" className="w-52 object-contain drop-shadow-2xl md:w-64" /><p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-200">En búsqueda de la excelencia</p></div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-[#0d1426]"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5"><p className="text-sm font-bold tracking-wide text-gray-300">DIEZ AÑOS DE FORMACIÓN · 2016—2026</p><img src="/images/04-logo-azul-circular.png" alt="Emblema Train Footbal" className="h-16 w-16 rounded-full object-contain" /></div></div>

      <section id="nosotros" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Nuestra identidad</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Formación con una mirada integral del juego.</h2></div><div className="text-lg leading-8 text-gray-300"><p>Desde 2016, Train Footbal trabaja en la formación y capacitación futbolística, promoviendo el aprendizaje, la planificación y la comprensión integral del juego.</p><p className="mt-5">Su propuesta integra contenidos técnicos, tácticos y físicos contextualizados a las necesidades del fútbol.</p></div></div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">{[["Metodología","Comprender el juego y planificar el entrenamiento."],["Formación","Compartir conocimientos y herramientas para jugadores y entrenadores."],["Desarrollo","Integrar técnica, táctica y preparación física."]].map(([titulo,texto])=><article key={titulo} className="border-t border-violet-400/70 pt-5"><h3 className="text-2xl font-bold">{titulo}</h3><p className="mt-3 leading-7 text-gray-400">{texto}</p></article>)}</div>
      </section>

      <section id="video" className="border-y border-white/10 bg-[#0d1426] py-20"><div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[0.75fr_1.25fr] md:px-12">
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Conocé nuestra historia</p><h2 className="mt-4 text-4xl font-black md:text-5xl">¿Quiénes somos?</h2><p className="mt-5 text-lg leading-8 text-gray-300">Te invitamos a conocer Train Footbal, nuestra identidad y la pasión que nos impulsa a seguir creciendo junto al fútbol.</p><a href="https://www.youtube.com/watch?v=QrCShh19wao" target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full border border-amber-300/60 px-6 py-3 font-bold text-amber-200 hover:bg-amber-300 hover:text-[#080d1b]">Ver en YouTube ↗</a></div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"><div className="aspect-video w-full"><iframe className="h-full w-full" src="https://www.youtube-nocookie.com/embed/QrCShh19wao" title="Train Footbal — ¿Quiénes somos?" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div>
      </div></section>

      <section id="staff" className="bg-[#10182a] py-20"><div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Las personas detrás del proyecto</p><h2 className="mt-3 text-4xl font-black md:text-5xl">Staff Train Footbal</h2><p className="mt-4 max-w-2xl leading-7 text-gray-400">Un equipo interdisciplinario comprometido con la formación, el desarrollo y la evolución del fútbol.</p>
        <div className="mt-12">
          <h3 className="text-2xl font-black text-amber-300 md:text-3xl">Fundadores y creadores</h3>
          <p className="mt-2 text-gray-400">Quienes dieron origen e impulsan el proyecto Train Footbal.</p>
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
          <p className="mt-2 text-gray-400">Profesionales que conforman el equipo Train Footbal.</p>
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
        <img src="/images/03-campus-2026-circular.png" alt="Campus de tecnificación Train Footbal 2026" className="mx-auto h-72 w-72 rounded-full object-contain" loading="lazy" />
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Experiencia de formación</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Campus de tecnificación 2026</h2><p className="mt-5 text-lg leading-8 text-gray-300">Cuatro jornadas de trabajo intensivo destinadas a jugadores de las categorías 2011, 2012, 2013 y 2014.</p><p className="mt-6 font-bold text-amber-300">7 al 10 de diciembre de 2026</p><p className="mt-1 text-gray-400">Club Atlético Banco Provincia · Bahía Blanca</p><ul className="mt-7 space-y-3 text-gray-300"><li>— Trabajo técnico-táctico</li><li>— Preparación física contextualizada</li><li>— Prevención y nutrición</li><li>— Análisis de video</li></ul><a href="https://docs.google.com/forms/d/e/1FAIpQLSfkzVC-qGFblfWFWS2CqaOGHDdlGvkTyuaQkDGQ8en5OCq7vQ/viewform?pli=1" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-amber-300 px-7 py-4 font-extrabold text-[#080d1b] hover:bg-amber-200">Inscribirme al campus ↗</a></div>
      </div>
      <div className="mt-14 border-t border-white/10 pt-10"><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Equipo a cargo</p><h3 className="mt-3 text-2xl font-black md:text-3xl">Profesionales del Campus</h3><div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">{campusStaff.map(persona=><article key={persona.nombre} className="border-l-2 border-amber-300/70 bg-[#10182a] p-5"><h4 className="font-bold">{persona.nombre}</h4><p className="mt-2 text-sm text-gray-400">{persona.rol}</p></article>)}</div></div>
      </section>

      <section id="jornada" className="border-y border-white/10 bg-[#10182a] py-20"><div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_0.8fr] md:items-center md:px-12">
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Formación para entrenadores</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Jornada teórico-práctica</h2><p className="mt-5 text-lg leading-8 text-gray-300">Un espacio de capacitación para profundizar en la metodología de entrenamiento, el modelo de juego y la preparación del futbolista.</p><p className="mt-6 font-bold text-amber-300">11 de diciembre de 2026 · Bahía Blanca</p><a href="https://wa.link/qb0ao7" className="mt-7 inline-flex rounded-full border border-white/30 px-6 py-3 font-bold hover:bg-white/10">Consultar por la jornada</a></div>
        <img src="/images/05-capacitacion-circular.png" alt="Capacitaciones Train Footbal" className="mx-auto h-64 w-64 rounded-full object-contain" loading="lazy" />
      </div></section>

      <section id="cursos" className="mx-auto max-w-7xl px-6 py-20 md:px-12"><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Formación continua</p><h2 className="mt-3 text-4xl font-black md:text-5xl">Cursos y webinars CADS</h2><p className="mt-5 max-w-2xl leading-7 text-gray-400">Propuestas online de formación profesional. Elegí el curso y accedé a su página oficial.</p>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">{cursos.map((curso,i)=><a key={curso.url} href={curso.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-5 py-6 hover:text-violet-300"><div className="flex items-center gap-5"><span className="text-sm text-gray-500">0{i+1}</span><h3 className="text-lg font-semibold md:text-xl">{curso.nombre}</h3></div><span className="text-2xl transition group-hover:translate-x-1">↗</span></a>)}</div>
      </section>

      <section id="novedades" className="border-y border-white/10 bg-[#10182a] py-20"><div className="mx-auto max-w-7xl px-6 md:px-12"><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Actualidad Train Footbal</p><h2 className="mt-3 text-4xl font-black md:text-5xl">Novedades</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{novedades.map(item=><article key={item.titulo} className="flex flex-col border border-white/10 bg-[#080d1b] p-6"><p className="text-xs font-bold tracking-[0.2em] text-amber-300">{item.categoria}</p><h3 className="mt-4 text-xl font-bold">{item.titulo}</h3><p className="mt-3 flex-1 leading-7 text-gray-400">{item.texto}</p><a href={item.destino} className="mt-6 font-bold text-violet-300 hover:text-violet-200">Conocer más →</a></article>)}</div></div></section>

      <section className="bg-[#080d1b] py-16"><div className="mx-auto max-w-7xl px-6 md:px-12"><p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Nuestro trabajo</p><h2 className="mt-3 text-3xl font-black md:text-4xl">El fútbol, en el campo</h2><p className="mt-4 max-w-lg text-gray-400">Entrenamientos y experiencias de formación de Train Footbal.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{entrenamientos.map((foto,i)=><img key={foto} src={`${base}${encodeURIComponent(foto)}`} alt={`Actividad de entrenamiento Train Footbal ${i+1}`} loading="lazy" className={`w-full object-cover ${i===0?"aspect-[4/5] sm:row-span-2 sm:h-full":"aspect-[4/3]"}`} />)}</div></div></section>

      <section aria-label="Auspiciantes de Train Footbal" className="border-y border-white/10 bg-[#10182a] py-14"><div className="mx-auto max-w-7xl px-5 md:px-10"><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">NOS ACOMPAÑAN</p><p className="mt-3 text-sm text-gray-400">Gracias a quienes acompañan y hacen posible el crecimiento de Train Footbal.</p></div><div className="mt-9 grid grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:grid-cols-5">{sponsorsDB.map(sponsor=><div key={sponsor.id} className="flex h-24 items-center justify-center rounded-xl border border-white/10 bg-[#080d1b] px-4 py-3 transition hover:border-amber-300/40">{sponsor.logo_url && <img src={sponsor.logo_url} alt={sponsor.nombre} loading="lazy" className="h-full w-full object-contain" />}</div>)}</div></div></section>

      <footer id="contacto" className="border-t border-white/10 bg-[#050914]"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-center md:px-12"><div><img src="/images/02-logo-blanco-circular.png" alt="Train Footbal" className="h-14 w-14 rounded-full object-contain" /><p className="mt-4 text-sm text-gray-400">Formación, capacitación y desarrollo futbolístico.</p><p className="mt-2 text-xs text-gray-500">Diez años · 2016—2026</p></div><div className="flex flex-wrap gap-6 text-sm text-gray-300"><a href="https://www.instagram.com/train_football/" target="_blank" rel="noreferrer">Instagram</a><a href="https://youtube.com/@trainfootball7580" target="_blank" rel="noreferrer">YouTube</a><a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer">WhatsApp</a></div></div><p className="border-t border-white/10 px-6 py-5 text-center text-xs text-gray-500">© 2026 Train Footbal. Todos los derechos reservados.</p></footer>
      <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer" aria-label="Contactar a Train Footbal por WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-lg hover:bg-green-400">WhatsApp ↗</a>
    </main>
  );
}
