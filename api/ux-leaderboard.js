const LEADERBOARD_KEY = "ux:detective:leaderboard";
const SESSION_PREFIX = "ux:detective:session:";
const MAX_LIMIT = 50;

function hasKVConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvCommand(...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("KV no configurado.");
  }

  const path = args.map((arg) => encodeURIComponent(String(arg))).join("/");
  const response = await fetch(`${url}/${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || `Error KV (${response.status})`);
  }

  return data.result;
}

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeEntry(entry) {
  return {
    sessionId: String(entry.sessionId || ""),
    name: String(entry.name || "Sin nombre"),
    score: Number(entry.score || 0),
    total: Number(entry.total || 36),
    updatedAt: entry.updatedAt || new Date().toISOString(),
  };
}

async function getLeaderboard(limit) {
  const safeLimit = clamp(Number(limit) || 30, 1, MAX_LIMIT);
  const sessionIds = await kvCommand("ZREVRANGE", LEADERBOARD_KEY, 0, safeLimit - 1);

  if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
    return [];
  }

  const sessionKeys = sessionIds.map((id) => `${SESSION_PREFIX}${id}`);
  const records = await kvCommand("MGET", ...sessionKeys);

  const entries = [];
  sessionIds.forEach((sessionId, index) => {
    const raw = Array.isArray(records) ? records[index] : null;
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      entries.push(normalizeEntry({ ...parsed, sessionId }));
    } catch {
      // Ignora registros corruptos
    }
  });

  return entries;
}

async function submitScore(body) {
  const sessionId = String(body?.sessionId || "").trim();
  const name = String(body?.name || "").trim();
  const score = Number(body?.score);
  const total = 36;

  if (!sessionId || sessionId.length > 120) {
    return { ok: false, status: 400, message: "sessionId inválido." };
  }

  if (!name || name.length > 60) {
    return { ok: false, status: 400, message: "name inválido." };
  }

  if (!Number.isInteger(score) || score < 0 || score > total) {
    return { ok: false, status: 400, message: "score inválido." };
  }

  const sessionKey = `${SESSION_PREFIX}${sessionId}`;
  const existingRaw = await kvCommand("GET", sessionKey);

  let shouldUpdate = true;
  if (existingRaw) {
    try {
      const existing = JSON.parse(existingRaw);
      if (Number(existing.score || 0) > score) {
        shouldUpdate = false;
      }
    } catch {
      shouldUpdate = true;
    }
  }

  if (shouldUpdate) {
    const record = {
      sessionId,
      name,
      score,
      total,
      updatedAt: new Date().toISOString(),
    };

    await kvCommand("SET", sessionKey, JSON.stringify(record));
    await kvCommand("ZADD", LEADERBOARD_KEY, score, sessionId);
  }

  const entries = await getLeaderboard(30);
  return { ok: true, status: 200, entries };
}

module.exports = async function handler(req, res) {
  if (!hasKVConfig()) {
    return json(res, 503, {
      ok: false,
      message:
        "Leaderboard global no configurado. Define KV_REST_API_URL y KV_REST_API_TOKEN en Vercel.",
      entries: [],
    });
  }

  try {
    if (req.method === "GET") {
      const entries = await getLeaderboard(req.query?.limit);
      return json(res, 200, { ok: true, entries });
    }

    if (req.method === "POST") {
      let body;
      try {
        body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
      } catch {
        return json(res, 400, { ok: false, message: "JSON inválido." });
      }
      const result = await submitScore(body);
      return json(res, result.status, result);
    }

    return json(res, 405, { ok: false, message: "Método no permitido." });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      message: error instanceof Error ? error.message : "Error interno",
    });
  }
};
