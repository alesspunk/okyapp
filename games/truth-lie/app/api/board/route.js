import { getClientIp } from "../../../lib/auth";
import {
  countQueued,
  getCurrentRound,
  getDatabaseDebugInfo,
  getNextQueued,
  listSubmissions,
} from "../../../lib/db/client";
import { json } from "../../../lib/http";
import { consumeRateLimit } from "../../../lib/rate-limit";

export const dynamic = "force-dynamic";

const BOARD_LIMIT = 300;
const BOARD_WINDOW_MS = 60 * 1000;

export async function GET(request) {
  const debug = request.nextUrl.searchParams.get("debug") === "1";
  const ip = getClientIp(request);
  if (!consumeRateLimit(`board:${ip}`, BOARD_LIMIT, BOARD_WINDOW_MS)) {
    return json({ ok: false, message: "Demasiadas peticiones." }, 429);
  }

  try {
    const [currentRound, nextQueued, queuedCount] = await Promise.all([
      getCurrentRound(),
      getNextQueued(),
      countQueued(),
    ]);

    if (!currentRound) {
      const response = {
        ok: true,
        currentRound: null,
        queuedCount,
        nextQueued: nextQueued ? { id: nextQueued.id, displayName: nextQueued.displayName } : null,
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
    }

    const revealLie = currentRound.status === "revealed";

    const response = {
      ok: true,
      queuedCount,
      nextQueued: nextQueued ? { id: nextQueued.id, displayName: nextQueued.displayName } : null,
      currentRound: {
        id: currentRound.id,
        displayName: currentRound.displayName,
        status: currentRound.status,
        statements: currentRound.statements.map((text, index) => ({
          index,
          text,
          isLie: revealLie && index === currentRound.lieIndex,
        })),
      },
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
        message: "No se pudo cargar el tablero público.",
        detail: error instanceof Error ? error.message : "unknown",
      },
      500,
    );
  }
}
