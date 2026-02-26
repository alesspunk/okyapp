export const LIMITS = {
  nameMin: 2,
  nameMax: 40,
  statementMin: 8,
  statementMax: 220,
};

function cleanText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateJoinPayload(payload) {
  const displayName = cleanText(payload?.displayName);
  const statementsInput = Array.isArray(payload?.statements) ? payload.statements : [];
  const statements = statementsInput.map(cleanText);
  const lieIndex = Number(payload?.lieIndex);

  if (displayName.length < LIMITS.nameMin || displayName.length > LIMITS.nameMax) {
    return {
      ok: false,
      message: `El nombre debe tener entre ${LIMITS.nameMin} y ${LIMITS.nameMax} caracteres.`,
    };
  }

  if (statements.length !== 3) {
    return { ok: false, message: "Debes ingresar exactamente 3 enunciados." };
  }

  for (const statement of statements) {
    if (statement.length < LIMITS.statementMin || statement.length > LIMITS.statementMax) {
      return {
        ok: false,
        message: `Cada enunciado debe tener entre ${LIMITS.statementMin} y ${LIMITS.statementMax} caracteres.`,
      };
    }
  }

  const unique = new Set(statements.map((s) => s.toLowerCase()));
  if (unique.size !== 3) {
    return { ok: false, message: "Los 3 enunciados deben ser diferentes." };
  }

  if (![0, 1, 2].includes(lieIndex)) {
    return { ok: false, message: "Selecciona cuál enunciado es la mentira." };
  }

  return {
    ok: true,
    data: {
      displayName,
      statements,
      lieIndex,
    },
  };
}
