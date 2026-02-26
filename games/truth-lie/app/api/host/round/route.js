import { getClientIp, requireHost } from "../../../../lib/auth";
import {
  archiveRound,
  countQueued,
  getCurrentRound,
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

    if (action === "start") {
      if (!parsedId) {
        return json({ ok: false, message: "entryId inválido para iniciar ronda." }, 400);
      }
      updated = await startRound(parsedId);
      if (!updated) {
        return json({ ok: false, message: "La ronda no está disponible para iniciar." }, 409);
      }
    } else if (action === "reveal") {
      const targetId = parsedId || (await getCurrentRound())?.id;
      if (!targetId) {
        return json({ ok: false, message: "No hay ronda activa para revelar." }, 409);
      }
      updated = await revealRound(targetId);
      if (!updated) {
        return json({ ok: false, message: "La ronda no está activa o ya fue revelada." }, 409);
      }
    } else if (action === "archive") {
      const targetId = parsedId || (await getCurrentRound())?.id;
      if (!targetId) {
        return json({ ok: false, message: "No hay ronda para archivar." }, 409);
      }
      updated = await archiveRound(targetId);
      if (!updated) {
        return json({ ok: false, message: "La ronda no está en estado archivable." }, 409);
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
