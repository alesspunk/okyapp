import { getClientIp } from "../../../lib/auth";
import {
  countQueued,
  getCurrentRound,
  getDatabaseDebugInfo,
  getQueueAhead,
  getSubmissionByToken,
  listSubmissions,
} from "../../../lib/db/client";
import { json } from "../../../lib/http";
import { consumeRateLimit } from "../../../lib/rate-limit";

export const dynamic = "force-dynamic";

const READ_LIMIT = 240;
const READ_WINDOW_MS = 60 * 1000;

function isValidToken(token) {
  return /^[a-zA-Z0-9-]{12,64}$/.test(token);
}

export async function GET(request) {
  const ip = getClientIp(request);
  if (!consumeRateLimit(`player:${ip}`, READ_LIMIT, READ_WINDOW_MS)) {
    return json({ ok: false, message: "Límite temporal alcanzado." }, 429);
  }

  const token = request.nextUrl.searchParams.get("token")?.trim() || "";
  const debug = request.nextUrl.searchParams.get("debug") === "1";
  if (!isValidToken(token)) {
    return json({ ok: false, message: "Token inválido." }, 400);
  }

  try {
    const entry = await getSubmissionByToken(token);
    if (!entry) {
      return json({ ok: false, message: "Participante no encontrado." }, 404);
    }

    const [queueAhead, queuedCount, currentRound] = await Promise.all([
      getQueueAhead(token),
      countQueued(),
      getCurrentRound(),
    ]);

    const revealedLie =
      entry.status === "revealed" || entry.status === "archived"
        ? entry.statements[entry.lieIndex]
        : null;

    const response = {
      ok: true,
      entry: {
        id: entry.id,
        displayName: entry.displayName,
        status: entry.status,
        submittedAt: entry.submittedAt,
        revealedLie,
      },
      queueAhead,
      queuedCount,
      currentRound: currentRound
        ? {
            id: currentRound.id,
            displayName: currentRound.displayName,
            status: currentRound.status,
          }
        : null,
    };

    if (debug) {
      const all = await listSubmissions();
      response.debug = {
        ...getDatabaseDebugInfo(),
        totalEntries: all.length,
        firstEntryIds: all.slice(0, 10).map((item) => item.id),
      };
    }

    return json(response);
  } catch (error) {
    return json(
      {
        ok: false,
        message: "No se pudo obtener el estado del jugador.",
        detail: error instanceof Error ? error.message : "unknown",
      },
      500,
    );
  }
}
