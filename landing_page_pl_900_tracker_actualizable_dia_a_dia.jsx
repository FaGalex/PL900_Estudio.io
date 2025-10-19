import React, { useEffect, useMemo, useState } from "react";

// 👉 Landing page de progreso para el plan PL‑900 (14 días)
// - Persistencia local con localStorage
// - Edición rápida de avance, puntaje y notas
// - Barra de progreso
// - Exportar/Importar JSON
// - Sección de recursos y agenda
// - 100% estático, ideal para desplegar en GitHub Pages / Netlify

const LS_KEY = "pl900-progress-v1";

const initialDays = [
  { id: 1, title: "Intro a Power Platform", goals: ["Qué es y para qué sirve", "Componentes y ecosistema"], links: ["https://learn.microsoft.com/es-es/training/modules/introduction-power-platform/"] },
  { id: 2, title: "Beneficios & Arquitectura", goals: ["Integración con M365/Azure/Dynamics", "Roles: maker/admin"], links: [] },
  { id: 3, title: "Power BI — Fundamentos", goals: ["Desktop vs Service", "Primer informe"], links: ["https://learn.microsoft.com/es-es/training/modules/get-started-power-bi/"] },
  { id: 4, title: "Power BI — Transformación & Modelo", goals: ["Power Query", "Relaciones y DAX"], links: [] },
  { id: 5, title: "Power BI — Dashboards & Sharing", goals: ["Buenas prácticas de visualización", "Publicar y compartir"], links: [] },
  { id: 6, title: "Repaso Power BI + Quiz", goals: ["Knowledge check", "Identificar puntos débiles"], links: ["https://learn.microsoft.com/es-es/training/modules/get-started-power-bi/8-knowledge-check"] },
  { id: 7, title: "Power Apps — Tipos de Apps", goals: ["Canvas vs Model-driven vs Portals", "Primera app"], links: ["https://learn.microsoft.com/es-es/training/modules/get-started-power-apps/"] },
  { id: 8, title: "Power Apps — Conectores & Controles", goals: ["Formularios, galerías, fórmulas", "Buenas prácticas"], links: [] },
  { id: 9, title: "Power Automate — Flujos", goals: ["Automático/Instantáneo/Programado", "Primer flujo"], links: ["https://learn.microsoft.com/es-es/training/modules/get-started-power-automate/"] },
  { id: 10, title: "Power Automate Desktop — RPA", goals: ["Automatización escritorio", "Precauciones RPA"], links: [] },
  { id: 11, title: "Power Virtual Agents — Bots", goals: ["Temas y entidades", "Publicación"], links: ["https://learn.microsoft.com/es-es/training/modules/get-started-power-virtual-agents/"] },
  { id: 12, title: "Microsoft Dataverse", goals: ["Tablas/Relaciones", "Seguridad (fila/columna)"], links: [] },
  { id: 13, title: "Integración — Casos prácticos", goals: ["Apps + Automate + BI", "Teams"], links: [] },
  { id: 14, title: "Simulacro Final + Revisión", goals: ["MeasureUp / Learn Path", "Checklist de examen"], links: ["https://www.measureup.com/microsoft-pl-900-microsoft-power-platform-fundamentals.html", "https://learn.microsoft.com/es-es/training/paths/power-platform-fundamentals/"] },
];

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

export default function PL900TrackerLanding() {
  const [entries, setEntries] = useState(() => {
    const saved = loadState();
    if (saved?.entries) return saved.entries;
    // Crear entradas base a partir del plan de 14 días
    return initialDays.map((d) => ({
      id: d.id,
      title: d.title,
      done: false,
      date: "",
      score: "",
      notes: "",
      links: d.links,
      goals: d.goals,
    }));
  });

  const [name, setName] = useState(() => loadState()?.name || "");
  const [examDate, setExamDate] = useState(() => loadState()?.examDate || "");
  const [dark, setDark] = useState(() => loadState()?.dark ?? true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    saveState({ entries, name, examDate, dark });
  }, [entries, name, examDate, dark]);

  const completed = useMemo(() => entries.filter((e) => e.done).length, [entries]);
  const progress = Math.round((completed / Math.max(1, entries.length)) * 100);

  function updateEntry(id, patch) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addCustomDay() {
    const nextId = entries.length ? Math.max(...entries.map((e) => e.id)) + 1 : 1;
    setEntries((prev) => [
      ...prev,
      { id: nextId, title: `Día ${nextId} — Personalizado`, done: false, date: "", score: "", notes: "", links: [], goals: [] },
    ]);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ name, examDate, entries }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pl900-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data?.entries?.length) setEntries(data.entries);
        if (typeof data?.name === "string") setName(data.name);
        if (typeof data?.examDate === "string") setExamDate(data.examDate);
      } catch (e) {
        alert("Archivo inválido");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Header / Hero */}
      <header className="border-b border-slate-200/40 dark:border-slate-800 sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500" />
            <div>
              <h1 className="text-xl font-semibold">PL‑900 Tracker</h1>
              <p className="text-xs opacity-70">Landing page · progreso día a día</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark((d) => !d)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm">{dark ? "☀️ Claro" : "🌙 Oscuro"}</button>
            <button onClick={exportJSON} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm shadow">Exportar JSON</button>
            <label className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
              Importar JSON
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importJSON(e.target.files[0])} />
            </label>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Tu ruta hacia la certificación <span className="text-indigo-600">PL‑900</span></h2>
            <p className="opacity-80 mb-4">Registra tu avance diario, guarda notas y mide tu progreso del plan de 14 días. Ideal para desplegar como landing page personal.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs opacity-70">Avance</p>
                <p className="text-2xl font-bold">{progress}%</p>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs opacity-70">Días completos</p>
                <p className="text-2xl font-bold">{completed}/{entries.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs opacity-70">Fecha de examen</p>
                <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="mt-1 w-full bg-transparent border rounded-xl px-3 py-2 border-slate-200 dark:border-slate-700 text-sm" />
              </div>
            </div>
          </div>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="text-xs opacity-70">Tu nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="mt-1 w-full bg-transparent border rounded-xl px-3 py-2 border-slate-200 dark:border-slate-700" />
            <div className="mt-4 text-sm">
              <p className="opacity-80">Recursos rápidos:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><a className="text-indigo-600 hover:underline" href="https://learn.microsoft.com/es-es/certifications/exams/pl-900/" target="_blank" rel="noreferrer">Guía oficial del examen</a></li>
                <li><a className="text-indigo-600 hover:underline" href="https://learn.microsoft.com/es-es/training/paths/power-platform-fundamentals/" target="_blank" rel="noreferrer">Ruta de aprendizaje Microsoft Learn</a></li>
                <li><a className="text-indigo-600 hover:underline" href="https://learn.microsoft.com/es-es/power-platform/developer-plan" target="_blank" rel="noreferrer">Developer Plan (entorno gratuito)</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda 14 días */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Plan de 14 días</h3>
          <div className="flex gap-2">
            <button onClick={addCustomDay} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">Añadir día personalizado</button>
            <button onClick={() => setEntries(initialDays.map((d) => ({ id: d.id, title: d.title, done: false, date: "", score: "", notes: "", links: d.links, goals: d.goals })))} className="px-3 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-800">Resetear plan 14 días</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {entries.map((e) => (
            <div key={e.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={e.done} onChange={(ev) => updateEntry(e.id, { done: ev.target.checked })} className="w-5 h-5 accent-indigo-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">Día {e.id}</span>
                    <h4 className="font-semibold">{e.title}</h4>
                  </div>
                  {e.goals?.length ? (
                    <ul className="mt-1 text-sm opacity-80 list-disc pl-5 space-y-0.5">
                      {e.goals.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  ) : null}
                  {e.links?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {e.links.map((link, idx) => (
                        <a key={idx} href={link} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-indigo-600">Recurso {idx + 1}</a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs opacity-70">Fecha</label>
                  <input type="date" value={e.date} onChange={(ev) => updateEntry(e.id, { date: ev.target.value })} className="mt-1 w-full bg-transparent border rounded-xl px-3 py-2 border-slate-200 dark:border-slate-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs opacity-70">Puntaje / Quiz</label>
                  <input type="text" placeholder="ej. 8/10" value={e.score} onChange={(ev) => updateEntry(e.id, { score: ev.target.value })} className="mt-1 w-full bg-transparent border rounded-xl px-3 py-2 border-slate-200 dark:border-slate-700 text-sm" />
                </div>
                <div>
                  <label className="text-xs opacity-70">Estado</label>
                  <select value={e.done ? "Completado" : "Pendiente"} onChange={(ev) => updateEntry(e.id, { done: ev.target.value === "Completado" })} className="mt-1 w-full bg-transparent border rounded-xl px-3 py-2 border-slate-200 dark:border-slate-700 text-sm">
                    <option>Pendiente</option>
                    <option>Completado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs opacity-70">Notas</label>
                <textarea value={e.notes} onChange={(ev) => updateEntry(e.id, { notes: ev.target.value })} placeholder="Resumen del día, dudas, enlaces adicionales…" className="mt-1 w-full bg-transparent border rounded-xl px-3 py-2 border-slate-200 dark:border-slate-700 text-sm min-h-[70px]" />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => updateEntry(e.id, { title: prompt("Nuevo título para el día:", e.title) || e.title })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">Renombrar</button>
                <button onClick={() => setEntries((prev) => prev.filter((x) => x.id !== e.id))} className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="opacity-70">Hecho con 💙 para el camino de certificación PL‑900. 100% estático (localStorage).</p>
          <div className="flex items-center gap-3">
            <a className="text-indigo-600 hover:underline" href="https://github.com/" target="_blank" rel="noreferrer">Guía de despliegue en GitHub Pages</a>
            <a className="text-indigo-600 hover:underline" href="https://www.netlify.com/" target="_blank" rel="noreferrer">Desplegar en Netlify</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
