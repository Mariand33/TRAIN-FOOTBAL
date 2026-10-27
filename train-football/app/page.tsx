
const base = "/images/train-fotos/";

const cursos = [
  { nombre: "Modelos de juego en fútbol", url: "https://capacitacionescads.com/cursos/modelos-juego-futbol-sebastian-lopez" },
  { nombre: "Planificación en fútbol infantil y juvenil", url: "https://capacitacionescads.com/cursos/planificacion-futbol-infantiles-juveniles" },
  { nombre: "Principios tácticos del fútbol", url: "https://capacitacionescads.com/cursos/principios-tacticos-futbol" },
  { nombre: "Entrenamiento de fútbol competitivo", url: "https://capacitacionescads.com/cursos/entrenamiento-futbol-competitivo-organizacion" },
  { nombre: "Preparación física contextualizada al fútbol", url: "https://capacitacionescads.com/cursos/la-preparacion-fisica-contextualizada-al-futbol" },
];

const staff = [
  { nombre: "Sebastián del Río", foto: "Seba del Rio 2.jpg" },
  { nombre: "Ariel", foto: "Ariel 1.jpg" },
  { nombre: "Federico Ochoa", foto: "fede ochoa.jpg" },
  { nombre: "Lucas", foto: "Lucas O.jpg" },
  { nombre: "Manuco", foto: "Manuco 1.jpeg" },
  { nombre: "José Luis", foto: "Jose Luis 2.jpg" },
  { nombre: "Ricky", foto: "Ricky.jpeg" },
];

const sponsors = [
  { nombre: "Distriven", foto: "Logo1 Distriven.jpg.jpeg" },
  { nombre: "Catalgas", foto: "Catalgas.png" },
  { nombre: "CC Autos", foto: "cc autos.jpeg" },
  { nombre: "Pinturería 25 de Mayo", foto: "Pintu 25 de mayo.png" },
  { nombre: "Puig Ruano", foto: "Puig Ruano.jpeg" },
  { nombre: "Inmobiliaria", foto: "Inmobiliaria.jpeg" },
];

const entrenamientos = [
  "AF6A2095.JPG",
  "IMG-20190610-WA0003.jpg",
  "IMG-20190610-WA0004.jpg",
  "IMG-20190610-WA0005.jpg",
  "IMG-20190610-WA0034.jpg",
  "IMG-20190722-WA0088.jpg",
  "IMG-20190722-WA0089.jpg",
  "IMG-20190722-WA0090.jpg",
  "IMG-20190722-WA0091.jpg",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080d1b] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d1b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <a href="#inicio" aria-label="TRAIN Football, inicio">
            <img
              src="/images/02-logo-blanco-circular.png"
              alt="TRAIN Football"
              className="h-14 w-14 rounded-full object-contain"
            />
          </a>
          <nav className="hidden flex-wrap items-center gap-5 text-sm text-gray-300 lg:flex">
            <a href="#nosotros" className="hover:text-amber-300">Nosotros</a>
            <a href="#video" className="hover:text-amber-300">Video</a>
            <a href="#staff" className="hover:text-amber-300">Staff</a>
            <a href="#campus" className="hover:text-amber-300">Campus</a>
            <a href="#jornada" className="hover:text-amber-300">Capacitaciones</a>
            <a href="#cursos" className="hover:text-amber-300">Cursos CADS</a>
            <a href="#contacto" className="hover:text-amber-300">Contacto</a>
          </nav>
          <a href="https://wa.link/qb0ao7" className="shrink-0 rounded-full bg-violet-600 px-4 py-3 text-sm font-bold hover:bg-violet-500">
            Contactanos
          </a>
        </div>
      </header>

      <section id="inicio" className="relative isolate overflow-hidden border-b border-amber-300/20 bg-[#080d1b]">
        <img
          src={`${base}Grupo%20de%20entrenamiento.png`}
          alt="Entrenamiento de TRAIN Football"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080d1b] via-[#080d1b]/90 to-[#080d1b]/35" />
        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[1fr_260px] md:px-12">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 border-y border-amber-300/40 py-3">
              <span className="text-amber-300">✦</span>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200 md:text-sm">
                2016 — 2026 · Diez años de trayectoria
              </p>
            </div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-gray-200">
              Formación · Capacitación · Metodología
            </p>
            <h1 className="text-5xl font-black leading-[1.04] tracking-tight md:text-7xl">
              Una década
              <br />
              <span className="text-amber-300">formando fútbol.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-200">
              Diez años de trabajo en la formación futbolística, la capacitación profesional y el desarrollo de una comprensión integral del juego.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#jornada" className="rounded-full bg-amber-300 px-6 py-4 font-extrabold text-[#080d1b] hover:bg-amber-200">
                Capacitaciones
              </a>
              <a href="#campus" className="rounded-full border border-white/50 px-6 py-4 font-bold hover:bg-white/10">
                Inscripción al Campus 2026
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={`${base}10%20a%C3%B1os%20transparentes.png`}
              alt="Diez años de TRAIN Football"
              className="w-52 object-contain drop-shadow-2xl md:w-64"
            />
            <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-200">
              En búsqueda de la excelencia
            </p>
          </div>
        </div>
      </section>

      <div className="border-b border-white/10 bg-[#0d1426]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <p className="text-sm font-bold tracking-wide text-gray-300">DIEZ AÑOS DE FORMACIÓN · 2016—2026</p>
          <img src="/images/04-logo-azul-circular.png" alt="Emblema TRAIN Football" className="h-16 w-16 rounded-full object-contain" />
        </div>
      </div>

      <section id="nosotros" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Nuestra identidad</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Formación con una mirada integral del juego.</h2>
          </div>
          <div className="text-lg leading-8 text-gray-300">
            <p>Desde 2016, TRAIN Football trabaja en la formación y capacitación futbolística, promoviendo el aprendizaje, la planificación y la comprensión integral del juego.</p>
            <p className="mt-5">Su propuesta integra contenidos técnicos, tácticos y físicos contextualizados a las necesidades del fútbol.</p>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            ["Metodología", "Comprender el juego y planificar el entrenamiento."],
            ["Formación", "Compartir conocimientos y herramientas para jugadores y entrenadores."],
            ["Desarrollo", "Integrar técnica, táctica y preparación física."],
          ].map(([titulo, texto]) => (
            <article key={titulo} className="border-t border-violet-400/70 pt-5">
              <h3 className="text-2xl font-bold">{titulo}</h3>
              <p className="mt-3 leading-7 text-gray-400">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="video" className="border-y border-white/10 bg-[#0d1426] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[0.75fr_1.25fr] md:px-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Conocé nuestra historia</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">¿Quiénes somos?</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              Te invitamos a conocer TRAIN Football, nuestra identidad y la pasión que nos impulsa a seguir creciendo junto al fútbol.
            </p>
            <a href="https://www.youtube.com/watch?v=QrCShh19wao" target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full border border-amber-300/60 px-6 py-3 font-bold text-amber-200 transition hover:bg-amber-300 hover:text-[#080d1b]">
              Ver en YouTube ↗
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-violet-950/30">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/QrCShh19wao"
                title="TRAIN Football — ¿Quiénes somos?"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section id="staff" className="bg-[#10182a] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Las personas detrás del proyecto</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Equipo TRAIN</h2> <a
  href="/staff"
  className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-bold text-[#080d1b] transition hover:bg-amber-200"
>
  Conocé al equipo →
</a>
          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Conocé a las personas que forman parte de TRAIN Football. Los cargos y especialidades se agregarán cuando estén confirmados.
          </p>
          <img src={`${base}STAFF%202026.png`} alt="Staff TRAIN Football 2026" className="mx-auto my-10 max-h-[560px] w-full object-contain" />
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {staff.map((persona) => (
              <article key={persona.foto} className="group">
                <div className="overflow-hidden bg-[#080d1b]">
                  <img src={`${base}${encodeURIComponent(persona.foto)}`} alt={`Fotografía de ${persona.nombre}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <h3 className="mt-3 text-lg font-bold">{persona.nombre}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="campus" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <img src="/images/03-campus-2026-circular.png" alt="Campus de tecnificación TRAIN Football 2026" className="mx-auto h-72 w-72 rounded-full object-contain" loading="lazy" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Experiencia de formación</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Campus de tecnificación 2026</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">Cuatro jornadas de trabajo intensivo destinadas a jugadores de las categorías 2012, 2013 y 2014.</p>
            <p className="mt-6 font-bold text-amber-300">7 al 10 de diciembre de 2026</p>
            <p className="mt-1 text-gray-400">Bahía Blanca</p>
            <ul className="mt-7 space-y-3 text-gray-300">
              <li>— Trabajo técnico-táctico</li>
              <li>— Preparación física contextualizada</li>
              <li>— Prevención y nutrición</li>
              <li>— Análisis de video</li>
            </ul>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfkzVC-qGFblfWFWS2CqaOGHDdlGvkTyuaQkDGQ8en5OCq7vQ/viewform?pli=1" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-amber-300 px-7 py-4 font-extrabold text-[#080d1b] hover:bg-amber-200">
              Inscribirme al campus ↗
            </a>
          </div>
        </div>
      </section>

      <section id="jornada" className="border-y border-white/10 bg-[#10182a] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_0.8fr] md:items-center md:px-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Formación para entrenadores</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Jornada teórico-práctica</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">Un espacio de capacitación para profundizar en la metodología de entrenamiento, el modelo de juego y la preparación del futbolista.</p>
            <p className="mt-6 font-bold text-amber-300">11 de diciembre de 2026 · Bahía Blanca</p>
            <a href="https://wa.link/qb0ao7" className="mt-7 inline-flex rounded-full border border-white/30 px-6 py-3 font-bold hover:bg-white/10">Consultar por la jornada</a>
          </div>
          <img src="/images/05-capacitacion-circular.png" alt="Capacitaciones TRAIN Football" className="mx-auto h-64 w-64 rounded-full object-contain" loading="lazy" />
        </div>
      </section>

      <section id="cursos" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Formación continua</p>
        <h2 className="mt-3 text-4xl font-black md:text-5xl">Cursos CADS</h2>
        <p className="mt-5 max-w-2xl leading-7 text-gray-400">Explorá las propuestas formativas disponibles a través de sus páginas oficiales.</p>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {cursos.map((curso, i) => (
            <a key={curso.url} href={curso.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-5 py-6 hover:text-violet-300">
              <div className="flex items-center gap-5">
                <span className="text-sm text-gray-500">0{i + 1}</span>
                <h3 className="text-lg font-semibold md:text-xl">{curso.nombre}</h3>
              </div>
              <span className="text-2xl transition group-hover:translate-x-1">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-[#10182a] py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Nuestro trabajo</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">El fútbol, en el campo</h2>
          <p className="mt-4 max-w-lg text-gray-400">Entrenamientos y experiencias de formación de TRAIN Football.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entrenamientos.map((foto, i) => (
              <img key={foto} src={`${base}${encodeURIComponent(foto)}`} alt={`Actividad de entrenamiento TRAIN Football ${i + 1}`} loading="lazy" className={`w-full object-cover ${i === 0 ? "aspect-[4/5] sm:row-span-2 sm:h-full" : "aspect-[4/3]"}`} />
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Sponsors de TRAIN Football" className="border-y border-amber-300/20 bg-[#080d1b] py-12">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-amber-200">Empresas que acompañan a TRAIN Football</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {sponsors.map((sponsor) => (
              <div key={sponsor.foto} className="flex h-20 w-40 items-center justify-center">
                <img src={`${base}${encodeURIComponent(sponsor.foto)}`} alt={sponsor.nombre} loading="lazy" className="max-h-16 max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contacto" className="border-t border-white/10 bg-[#050914]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-center md:px-12">
          <div>
            <img src="/images/02-logo-blanco-circular.png" alt="TRAIN Football" className="h-14 w-14 rounded-full object-contain" />
            <p className="mt-4 text-sm text-gray-400">Formación, capacitación y desarrollo futbolístico.</p>
            <p className="mt-2 text-xs text-gray-500">Diez años · 2016—2026</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <a href="https://www.instagram.com/train_football/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://youtube.com/@trainfootball7580" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
        <p className="border-t border-white/10 px-6 py-5 text-center text-xs text-gray-500">© 2026 TRAIN Football. Todos los derechos reservados.</p>
      </footer>

      <a href="https://wa.link/qb0ao7" target="_blank" rel="noreferrer" aria-label="Contactar a TRAIN Football por WhatsApp" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-lg hover:bg-green-400">
        WhatsApp ↗
      </a>
    </main>
  );
}
