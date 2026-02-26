import { getClientIp, requireHost } from "../../../../lib/auth";
import { countQueued, getCurrentRound, listSubmissions } from "../../../../lib/db/client";
import { json } from "../../../../lib/http";
import { consumeRateLimit } from "../../../../lib/rate-limit";

export const dynamic = "force-dynamic";

const HOST_LIMIT = 200;
const HOST_WINDOW_MS = 60 * 1000;

export async function GET(request) {
  const hostCheck = requireHost(request);
  if (!hostCheck.ok) {
    return hostCheck.response;
  }

  const ip = getClientIp(request);
  if (!consumeRateLimit(`host-list:${ip}`, HOST_LIMIT, HOST_WINDOW_MS)) {
    return json({ ok: false, message: "Demasiadas peticiones de host." }, 429);
  }

  try {
    const [entries, currentRound, queuedCount] = await Promise.all([
      listSubmissions(),
      getCurrentRound(),
      countQueued(),
    ]);

    return json({
      ok: true,
      queuedCount,
      currentRound,
      entries,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        message: "No se pudieron cargar las rondas.",
        detail: error instanceof Error ? error.message : "unknown",
      },
      500,
    );
  }
}
