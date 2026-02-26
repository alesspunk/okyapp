"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const POLL_MS = 2500;

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function statusLabel(status) {
  switch (status) {
    case "queued":
      return "En cola";
    case "active":
      return "Activa";
    case "revealed":
      return "Revelada";
    case "archived":
      return "Archivada";
    default:
      return status;
  }
}

function canAdvance(status) {
  return status === "active" || status === "revealed";
}

export default function HostDashboard() {
  const [hostCode, setHostCode] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [data, setData] = useState({ entries: [], currentRound: null, queuedCount: 0 });

  useEffect(() => {
    const saved = sessionStorage.getItem("truthLieHostCode") || "";
    if (saved) {
      setHostCode(saved);
      setReady(true);
    }
  }, []);

  const load = useCallback(async () => {
    if (!hostCode) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_PATH}/api/host/submissions`, {
        cache: "no-store",
        headers: {
          "x-host-code": hostCode,
          Accept: "application/json",
        },
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "No se pudo cargar el dashboard.");
      }

      setError("");
      setData(payload);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Error inesperado.";
      setError(message);
      if (message.toLowerCase().includes("código de host inválido")) {
        setReady(false);
        sessionStorage.removeItem("truthLieHostCode");
      }
    } finally {
      setLoading(false);
    }
  }, [hostCode]);

  useEffect(() => {
    if (!ready || !hostCode) return;
    load();
    const timer = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(timer);
  }, [ready, hostCode, load]);

  async function runAction(action, entryId) {
    if (!hostCode) return;

    setBusyAction(`${action}-${entryId || "current"}`);
    setError("");
    setInfo("");

    try {
      const response = await fetch(`${BASE_PATH}/api/host/round`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-host-code": hostCode,
          Accept: "application/json",
        },
        body: JSON.stringify({ action, entryId }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "No se pudo aplicar la acción.");
      }

      setInfo(payload.info || "");
      setData((previous) => {
        if (action === "reset") {
          return {
            entries: [],
            currentRound: null,
            queuedCount: 0,
          };
        }

        const nextEntries =
          payload.updated && payload.updated.id
            ? previous.entries.map((entry) =>
                Number(entry.id) === Number(payload.updated.id) ? { ...entry, ...payload.updated } : entry,
              )
            : previous.entries;

        return {
          entries: nextEntries,
          currentRound:
            payload.currentRound !== undefined ? payload.currentRound : previous.currentRound,
          queuedCount:
            typeof payload.queuedCount === "number" ? payload.queuedCount : previous.queuedCount,
        };
      });
      if (action === "reset") {
        window.setTimeout(() => {
          load();
        }, 1200);
      } else {
        await load();
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Error inesperado.");
    } finally {
      setBusyAction("");
    }
  }

  const queueEntries = useMemo(
    () => data.entries.filter((entry) => entry.status === "queued"),
    [data.entries],
  );
  const currentRoundId = data.currentRound ? Number(data.currentRound.id) : null;

  if (!ready) {
    return (
      <section className="tl-card tl-host-auth">
        <h2>Acceso host</h2>
        <p className="tl-muted">Ingresa el código secreto para administrar rondas.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!hostCode.trim()) return;
            sessionStorage.setItem("truthLieHostCode", hostCode.trim());
            setHostCode(hostCode.trim());
            setReady(true);
          }}
          className="tl-form"
        >
          <input
            className="tl-input"
            type="password"
            value={hostCode}
            onChange={(event) => setHostCode(event.target.value)}
            placeholder="HOST_CODE"
            required
          />
          <button className="btn btn-primary" type="submit">
            Entrar como host
          </button>
        </form>
        {error ? <p className="tl-error">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="tl-stack-lg">
      <div className="tl-card tl-host-top">
        <div>
          <h2>Dashboard de host</h2>
          <p className="tl-muted">Actualización en vivo cada 2.5 segundos.</p>
        </div>
        <div className="tl-inline-actions">
          <button className="btn btn-outlined" type="button" onClick={() => load()} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
          <button
            className="btn btn-danger"
            type="button"
            disabled={!!busyAction}
            onClick={() => {
              if (!window.confirm("Esto borrará todas las rondas y jugadores. ¿Continuar?")) return;
              runAction("reset");
            }}
          >
            Reiniciar juego
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              sessionStorage.removeItem("truthLieHostCode");
              setReady(false);
              setHostCode("");
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div className="tl-info-grid">
        <div className="tl-info-card">
          <p className="tl-info-label">Jugadores en cola</p>
          <p className="tl-info-value">{data.queuedCount}</p>
        </div>
        <div className="tl-info-card">
          <p className="tl-info-label">Siguiente sugerido</p>
          <p className="tl-info-value">{queueEntries[0]?.displayName || "Sin cola"}</p>
        </div>
        <div className="tl-info-card">
          <p className="tl-info-label">Ronda actual</p>
          <p className="tl-info-value">{data.currentRound?.displayName || "Ninguna"}</p>
        </div>
      </div>

      {data.currentRound ? (
        <article className="tl-card tl-current-round">
          <div className="tl-current-head">
            <h3>{data.currentRound.displayName}</h3>
            <span className={`tl-status tl-status-${data.currentRound.status}`}>
              {statusLabel(data.currentRound.status)}
            </span>
          </div>
          <ol className="tl-statement-list">
            {data.currentRound.statements.map((statement, index) => (
              <li key={index} className={data.currentRound.status === "revealed" && index === data.currentRound.lieIndex ? "is-lie" : ""}>
                {statement}
                {data.currentRound.status === "revealed" && index === data.currentRound.lieIndex ? (
                  <span className="tl-lie-chip">MENTIRA</span>
                ) : null}
              </li>
            ))}
          </ol>
          {data.currentRound.status === "revealed" ? (
            <p className="tl-reveal-copy">
              Mentira revelada: <strong>Enunciado {Number(data.currentRound.lieIndex) + 1}</strong>
            </p>
          ) : null}
          <div className="tl-inline-actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={data.currentRound.status !== "active" || busyAction !== ""}
              onClick={() => runAction("reveal", data.currentRound.id)}
            >
              {busyAction === `reveal-${data.currentRound.id}` ? "Revelando..." : "Reveal Lie"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              disabled={!canAdvance(data.currentRound.status) || busyAction !== ""}
              onClick={() => runAction("next", data.currentRound.id)}
            >
              {busyAction === `next-${data.currentRound.id}` ? "Avanzando..." : "Pasar al siguiente"}
            </button>
          </div>
        </article>
      ) : null}

      {info ? <p className="tl-info-banner">{info}</p> : null}
      {error ? <p className="tl-error">{error}</p> : null}

      <section className="tl-card tl-table-card">
        <h3>Participantes ({data.entries.length})</h3>
        <div className="tl-table-wrap">
          <table className="tl-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Enunciados</th>
                <th>Estado</th>
                <th>Enviado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry, index) => {
                const startBusy = busyAction === `start-${entry.id}`;
                const revealBusy = busyAction === `reveal-${entry.id}`;
                const nextBusy = busyAction === `next-${entry.id}`;
                const entryId = Number(entry.id);
                const effectiveStatus =
                  currentRoundId !== null && entryId === currentRoundId
                    ? data.currentRound.status
                    : entry.status;
                const isCurrentRound = currentRoundId !== null && entryId === currentRoundId;

                return (
                  <tr key={entry.id} className={isCurrentRound ? "tl-row-current" : ""}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{entry.displayName}</strong>
                      {isCurrentRound ? <span className="tl-current-badge">En vivo</span> : null}
                    </td>
                    <td>
                      <ol className="tl-statement-list tl-statement-list-compact">
                        {entry.statements.map((statement, statementIndex) => (
                          <li
                            key={statementIndex}
                            className={effectiveStatus === "revealed" && entry.lieIndex === statementIndex ? "is-lie" : ""}
                          >
                            {statement}
                            {effectiveStatus === "revealed" && entry.lieIndex === statementIndex ? (
                              <span className="tl-lie-chip">MENTIRA</span>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </td>
                    <td>
                      <span className={`tl-status tl-status-${effectiveStatus}`}>{statusLabel(effectiveStatus)}</span>
                    </td>
                    <td>{formatDate(entry.submittedAt)}</td>
                    <td>
                      <div className="tl-actions-cell">
                        <button
                          className="btn btn-primary btn-small"
                          type="button"
                          disabled={effectiveStatus !== "queued" || !!busyAction}
                          onClick={() => runAction("start", entry.id)}
                        >
                          {startBusy ? "Iniciando..." : "Start Round"}
                        </button>
                        <button
                          className="btn btn-secondary btn-small"
                          type="button"
                          disabled={effectiveStatus !== "active" || !!busyAction}
                          onClick={() => runAction("reveal", entry.id)}
                        >
                          {revealBusy ? "Revelando..." : "Reveal"}
                        </button>
                        <button
                          className="btn btn-outlined btn-small"
                          type="button"
                          disabled={!canAdvance(effectiveStatus) || !!busyAction}
                          onClick={() => runAction("next", entry.id)}
                        >
                          {nextBusy ? "Avanzando..." : "Pasar al siguiente"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data.entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tl-empty-cell">
                    Sin participantes todavía.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
