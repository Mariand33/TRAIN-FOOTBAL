export default function CapacitacionPage() {
  return (
    <main className="min-h-screen bg-[#080d1b] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-amber-300 hover:underline">
          ← Volver a Train Footbal
        </a>

        <div className="mb-8 mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
            Train Footbal · Formación
          </p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Inscripción a la capacitación
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Completá el formulario para registrar tus datos y participar de
            nuestras propuestas de capacitación.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfWHbKunKoqIHxNoeLTfVf4LRksC8fpAQuGxq_yOpR6TkBJxA/viewform?embedded=true"
            title="Formulario de inscripción a capacitación Train Footbal"
            width="100%"
            height="1500"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Cargando formulario…
          </iframe>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Si el formulario no se visualiza,
          {" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfWHbKunKoqIHxNoeLTfVf4LRksC8fpAQuGxq_yOpR6TkBJxA/viewform"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-amber-300 underline"
          >
            abrilo desde aquí
          </a>.
        </p>
      </div>
    </main>
  );
}
