import { getClientIp } from "../../../lib/auth";
import { countQueued, getCurrentRound, getQueueAhead, getSubmissionByToken } from "../../../lib/db/client";
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

    return json({
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
    });
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
