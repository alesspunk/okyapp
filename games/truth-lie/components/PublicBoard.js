"use client";

import { useEffect, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const POLL_MS = 2500;

export default function PublicBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ currentRound: null, queuedCount: 0, nextQueued: null });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch(`${BASE_PATH}/api/board`, {
          cache: "no-store",
        });

        const payload = await response.json();
        if (!response.ok || !payload.ok) {
          throw new Error(payload.message || "No se pudo cargar el board.");
        }

        if (!mounted) return;
        setData(payload);
        setError("");
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError instanceof Error ? loadError.message : "Error inesperado.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    const timer = window.setInterval(load, POLL_MS);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="tl-card tl-board">
      <header className="tl-board-head">
        <h2>Board público</h2>
        <span className="tl-chip">En cola: {data.queuedCount}</span>
      </header>
      <p className="tl-muted">Actualización automática cada 2.5 segundos.</p>

      {loading ? <p className="tl-muted">Cargando board...</p> : null}
      {error ? <p className="tl-error">{error}</p> : null}

      {!data.currentRound ? (
        <div className="tl-empty-board">
          <h3>Aún no hay ronda activa</h3>
          <p className="tl-muted">
            {data.nextQueued
              ? `Siguiente sugerido: ${data.nextQueued.displayName}`
              : "Esperando participantes."}
          </p>
        </div>
      ) : (
        <article className="tl-round-card">
          <div className="tl-current-head">
            <h3>{data.currentRound.displayName}</h3>
            <span className={`tl-status tl-status-${data.currentRound.status}`}>
              {data.currentRound.status === "active" ? "Votación" : "Revelado"}
            </span>
          </div>

          <ol className="tl-statement-list">
            {data.currentRound.statements.map((statement) => (
              <li key={statement.index} className={statement.isLie ? "is-lie" : ""}>
                {statement.text}
                {statement.isLie ? <span className="tl-lie-chip">Mentira</span> : null}
              </li>
            ))}
          </ol>
        </article>
      )}
    </section>
  );
}
