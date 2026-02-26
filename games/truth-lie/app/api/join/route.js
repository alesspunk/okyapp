import { getClientIp } from "../../../lib/auth";
import { insertSubmission } from "../../../lib/db/client";
import { json, safeJson } from "../../../lib/http";
import { consumeRateLimit } from "../../../lib/rate-limit";
import { validateJoinPayload } from "../../../lib/validation";

export const dynamic = "force-dynamic";

const JOIN_LIMIT = 20;
const JOIN_WINDOW_MS = 10 * 60 * 1000;

function makeToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }

  return `token-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (!consumeRateLimit(`join:${ip}`, JOIN_LIMIT, JOIN_WINDOW_MS)) {
    return json(
      {
        ok: false,
        message: "Demasiados intentos. Espera un momento e intenta de nuevo.",
      },
      429,
    );
  }

  const body = await safeJson(request);
  const parsed = validateJoinPayload(body);

  if (!parsed.ok) {
    return json({ ok: false, message: parsed.message }, 400);
  }

  try {
    const token = makeToken();
    const entry = await insertSubmission({
      token,
      displayName: parsed.data.displayName,
      statements: parsed.data.statements,
      lieIndex: parsed.data.lieIndex,
      ipAddress: ip,
    });

    return json({
      ok: true,
      token,
      entry: {
        id: entry.id,
        displayName: entry.displayName,
        status: entry.status,
        submittedAt: entry.submittedAt,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        message: "No se pudo registrar tu ronda. Intenta nuevamente.",
        detail: error instanceof Error ? error.message : "unknown",
      },
      500,
    );
  }
}
