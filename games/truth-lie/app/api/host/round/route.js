import { getClientIp, requireHost } from "../../../../lib/auth";
import {
  archiveRound,
  countQueued,
  getCurrentRound,
  getNextQueued,
  getSubmissionById,
  revealRound,
  startRound,
} from "../../../../lib/db/client";
import { json, safeJson } from "../../../../lib/http";
import { consumeRateLimit } from "../../../../lib/rate-limit";

export const dynamic = "force-dynamic";

const HOST_LIMIT = 120;
const HOST_WINDOW_MS = 60 * 1000;

function parseEntryId(raw) {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function POST(request) {
  const hostCheck = requireHost(request);
  if (!hostCheck.ok) {
    return hostCheck.response;
  }

  const ip = getClientIp(request);
  if (!consumeRateLimit(`host-round:${ip}`, HOST_LIMIT, HOST_WINDOW_MS)) {
    return json({ ok: false, message: "Demasiadas acciones en poco tiempo." }, 429);
  }

  const body = await safeJson(request);
  const action = String(body?.action || "").trim();
  const parsedId = parseEntryId(body?.entryId);

  try {
    let updated = null;
    let info = "";

    if (action === "start") {
      if (!parsedId) {
        return json({ ok: false, message: "entryId inválido para iniciar ronda." }, 400);
      }
      updated = await startRound(parsedId);
      if (!updated) {
        const existing = await getSubmissionById(parsedId);
        if (existing && existing.status === "active") {
          const [currentRound, queuedCount] = await Promise.all([getCurrentRound(), countQueued()]);
          return json({
            ok: true,
            action,
            updated: existing,
            currentRound,
            queuedCount,
            info: "La ronda ya estaba activa.",
          });
        }
        return json({ ok: false, message: "La ronda no está disponible para iniciar." }, 409);
      }
      info = "Ronda iniciada.";
    } else if (action === "reveal") {
      const targetId = parsedId || (await getCurrentRound())?.id;
      if (!targetId) {
        return json({ ok: false, message: "No hay ronda activa para revelar." }, 409);
      }
      updated = await revealRound(targetId);
      if (!updated) {
        const existing = await getSubmissionById(targetId);
        if (existing && existing.status === "revealed") {
          const [currentRound, queuedCount] = await Promise.all([getCurrentRound(), countQueued()]);
          return json({
            ok: true,
            action,
            updated: existing,
            currentRound,
            queuedCount,
            info: "La mentira ya estaba revelada.",
          });
        }
        return json({ ok: false, message: "La ronda no está activa para revelar." }, 409);
      }
      info = "Mentira revelada.";
    } else if (action === "archive") {
      const targetId = parsedId || (await getCurrentRound())?.id;
      if (!targetId) {
        return json({ ok: false, message: "No hay ronda para archivar." }, 409);
      }
      updated = await archiveRound(targetId);
      if (!updated) {
        return json({ ok: false, message: "La ronda no está en estado archivable." }, 409);
      }
      info = "Ronda cerrada.";
    } else if (action === "next") {
      const current = await getCurrentRound();
      if (!current) {
        return json({ ok: false, message: "No hay ronda actual para avanzar." }, 409);
      }

      const nextQueued = await getNextQueued();
      if (nextQueued) {
        updated = await startRound(nextQueued.id);
        if (!updated) {
          return json({ ok: false, message: "No se pudo iniciar el siguiente jugador." }, 409);
        }
        info = "Avanzaste al siguiente jugador.";
      } else {
        updated = await archiveRound(current.id);
        if (!updated) {
          return json({ ok: false, message: "No se pudo cerrar la ronda actual." }, 409);
        }
        info = "No hay más jugadores en cola. Ronda cerrada.";
      }
    } else {
      return json({ ok: false, message: "Acción inválida." }, 400);
    }

    const [currentRound, queuedCount] = await Promise.all([getCurrentRound(), countQueued()]);

    return json({
      ok: true,
      action,
      updated,
      currentRound,
      queuedCount,
      info,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        message: "No se pudo ejecutar la acción de ronda.",
        detail: error instanceof Error ? error.message : "unknown",
      },
      500,
    );
  }
}
