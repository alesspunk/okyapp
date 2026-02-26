"use client";

import { useMemo, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const MAX_NAME = 40;
const MAX_STATEMENT = 220;

const initialStatements = ["", "", ""];

export default function JoinForm() {
  const [displayName, setDisplayName] = useState("");
  const [statements, setStatements] = useState(initialStatements);
  const [lieIndex, setLieIndex] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    return {
      name: displayName.length,
      statements: statements.map((value) => value.length),
    };
  }, [displayName, statements]);

  function updateStatement(index, value) {
    const next = [...statements];
    next[index] = value;
    setStatements(next);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${BASE_PATH}/api/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          displayName,
          statements,
          lieIndex,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "No se pudo registrar tu entrada.");
      }

      localStorage.setItem(
        "truthLiePlayerSession",
        JSON.stringify({
          token: payload.token,
          displayName: payload.entry?.displayName || displayName,
        }),
      );

      window.location.assign(`${BASE_PATH}/waiting?token=${encodeURIComponent(payload.token)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="tl-card tl-form" onSubmit={onSubmit}>
      <div>
        <label className="tl-label" htmlFor="display-name">
          Nombre para mostrar
        </label>
        <input
          id="display-name"
          className="tl-input"
          placeholder="Ej: Andrea"
          maxLength={MAX_NAME}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          required
        />
        <p className="tl-counter">{counts.name}/{MAX_NAME}</p>
      </div>

      <div className="tl-form-group">
        <p className="tl-label">Escribe 3 enunciados (2 verdades y 1 mentira)</p>
        {statements.map((statement, index) => (
          <div key={index}>
            <label className="tl-sub-label" htmlFor={`statement-${index}`}>
              Enunciado {index + 1}
            </label>
            <textarea
              id={`statement-${index}`}
              className="tl-textarea"
              maxLength={MAX_STATEMENT}
              placeholder="Ej: He vivido en tres países."
              value={statement}
              onChange={(event) => updateStatement(index, event.target.value)}
              required
            />
            <p className="tl-counter">{counts.statements[index]}/{MAX_STATEMENT}</p>
          </div>
        ))}
      </div>

      <fieldset className="tl-fieldset">
        <legend className="tl-label">Privado: ¿cuál es la mentira?</legend>
        <p className="tl-help">Solo el host la verá cuando haga reveal.</p>
        <div className="tl-radio-list">
          {[0, 1, 2].map((index) => (
            <label key={index} className="tl-radio-row">
              <input
                type="radio"
                name="lieIndex"
                checked={lieIndex === index}
                onChange={() => setLieIndex(index)}
              />
              <span>Enunciado {index + 1}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error ? <p className="tl-error">{error}</p> : null}

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar ronda"}
      </button>
    </form>
  );
}
