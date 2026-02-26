"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const POLL_MS = 2500;

const STATUS_COPY = {
  queued: "En cola",
  active: "En vivo",
  revealed: "Mentira revelada",
  archived: "Ronda cerrada",
};

export default function WaitingRoom() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    const queryToken = searchParams.get("token")?.trim() || "";
    if (queryToken) {
      setToken(queryToken);
      try {
        const existing = JSON.parse(localStorage.getItem("truthLiePlayerSession") || "{}") || {};
        localStorage.setItem(
          "truthLiePlayerSession",
          JSON.stringify({
            ...existing,
            token: queryToken,
          }),
        );
      } catch {
        localStorage.setItem("truthLiePlayerSession", JSON.stringify({ token: queryToken }));
      }
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem("truthLiePlayerSession") || "{}");
      if (saved?.token) {
        setToken(saved.token);
      }
    } catch {
      // ignore local storage errors
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token) {
      setState({ loading: false, error: "No se encontró una sesión de jugador activa.", data: null });
      return;
    }

    let isMounted = true;

    async function poll() {
      try {
        const response = await fetch(`${BASE_PATH}/api/player?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(payload.message || "No se pudo consultar tu estado.");
        }

        if (!isMounted) return;
        setState({ loading: false, error: "", data: payload });
      } catch (error) {
        if (!isMounted) return;
        setState({
          loading: false,
          error: error instanceof Error ? error.message : "Error inesperado.",
          data: null,
        });
      }
    }

    poll();
    const timer = window.setInterval(poll, POLL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, [token]);

  const statusText = useMemo(() => {
    const status = state.data?.entry?.status;
    return status ? STATUS_COPY[status] || status : "Sin estado";
  }, [state.data]);

  const queueMessage = useMemo(() => {
    if (!state.data?.entry) return "";
    if (state.data.entry.status === "queued") {
      return `Hay ${state.data.queueAhead} jugador(es) delante de ti.`;
    }
    if (state.data.entry.status === "active") {
      return "Tu ronda está activa. El host ya puede leer tus enunciados.";
    }
    if (state.data.entry.status === "revealed") {
      return `Tu mentira fue: \"${state.data.entry.revealedLie}\"`;
    }
    if (state.data.entry.status === "archived") {
      return "Tu ronda finalizó. Gracias por participar.";
    }
    return "";
  }, [state.data]);

  return (
    <section className="tl-card tl-waiting">
      <h2>Sala de espera</h2>
      <p className="tl-muted">Mantén esta pantalla abierta; se actualiza automáticamente.</p>

      {state.loading ? <p className="tl-muted">Cargando estado...</p> : null}
      {state.error ? <p className="tl-error">{state.error}</p> : null}

      {state.data?.entry ? (
        <>
          <div className="tl-status-row">
            <span className={`tl-status tl-status-${state.data.entry.status}`}>{statusText}</span>
            <span className="tl-chip">Jugador: {state.data.entry.displayName}</span>
          </div>

          <p className="tl-highlight">{queueMessage}</p>

          <div className="tl-info-grid">
            <div className="tl-info-card">
              <p className="tl-info-label">En cola</p>
              <p className="tl-info-value">{state.data.queuedCount}</p>
            </div>
            <div className="tl-info-card">
              <p className="tl-info-label">Ronda actual</p>
              <p className="tl-info-value">{state.data.currentRound?.displayName || "Esperando host"}</p>
            </div>
          </div>
        </>
      ) : null}

      <div className="tl-inline-actions">
        <Link className="btn btn-secondary" href="/join">
          Editar entrada
        </Link>
        <Link className="btn btn-outlined" href="/board">
          Ver board público
        </Link>
      </div>
    </section>
  );
}
