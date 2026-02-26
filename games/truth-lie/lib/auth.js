import { json } from "./http";

export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function requireHost(request) {
  const expected = (process.env.HOST_CODE || "").trim();
  if (!expected) {
    return {
      ok: false,
      response: json(
        {
          ok: false,
          message: "HOST_CODE no está configurado en el entorno.",
        },
        500,
      ),
    };
  }

  const received = (request.headers.get("x-host-code") || "").trim();
  if (!received || received !== expected) {
    return {
      ok: false,
      response: json({ ok: false, message: "Código de host inválido." }, 401),
    };
  }

  return { ok: true };
}
