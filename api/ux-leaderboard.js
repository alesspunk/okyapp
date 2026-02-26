const LEADERBOARD_KEY = "ux:detective:leaderboard";
const SESSION_PREFIX = "ux:detective:session:";
const MAX_LIMIT = 50;
const DEFAULT_TOTAL = 33;
const MAX_TOTAL = 100;

function getRedisEnv() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_TOKEN;
  return { url, token };
}

function hasKVConfig() {
  const { url, token } = getRedisEnv();
  return Boolean(url && token);
}

async function kvCommand(...args) {
  const { url, token } = getRedisEnv();

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
  const total = Number(entry.total || DEFAULT_TOTAL);
  const score = Number(entry.score || 0);
  return {
    sessionId: String(entry.sessionId || ""),
    name: String(entry.name || "Sin nombre"),
    score: Math.max(0, Math.min(score, total)),
    total,
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
    if (
      sessionId === "smoke-test-session" ||
      sessionId === "user-a-live" ||
      sessionId === "user-b-live" ||
      sessionId.startsWith("live-test-")
    ) {
      return;
    }
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
  const incomingTotal = Number(body?.total);
  const total =
    Number.isInteger(incomingTotal) && incomingTotal > 0 && incomingTotal <= MAX_TOTAL
      ? incomingTotal
      : DEFAULT_TOTAL;

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
        "Leaderboard global no configurado. Conecta Upstash/Redis en Vercel (KV_REST_* o UPSTASH_REDIS_REST_*).",
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
