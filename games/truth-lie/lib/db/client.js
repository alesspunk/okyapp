import { db, sql } from "@vercel/postgres";

let schemaPromise;

function mapEntry(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    statements: [row.statement_one, row.statement_two, row.statement_three],
    lieIndex: row.lie_index,
    status: row.status,
    submittedAt: row.submitted_at,
    roundStartedAt: row.round_started_at,
    revealedAt: row.revealed_at,
    archivedAt: row.archived_at,
  };
}

export async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS truth_lie_entries (
          id BIGSERIAL PRIMARY KEY,
          player_token VARCHAR(64) NOT NULL UNIQUE,
          display_name VARCHAR(40) NOT NULL,
          statement_one VARCHAR(220) NOT NULL,
          statement_two VARCHAR(220) NOT NULL,
          statement_three VARCHAR(220) NOT NULL,
          lie_index SMALLINT NOT NULL CHECK (lie_index IN (0,1,2)),
          status VARCHAR(16) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'active', 'revealed', 'archived')),
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          round_started_at TIMESTAMPTZ,
          revealed_at TIMESTAMPTZ,
          archived_at TIMESTAMPTZ,
          created_ip VARCHAR(64)
        )
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS truth_lie_entries_status_submitted_idx
        ON truth_lie_entries (status, submitted_at, id)
      `;

      await sql`
        CREATE INDEX IF NOT EXISTS truth_lie_entries_submitted_idx
        ON truth_lie_entries (submitted_at, id)
      `;
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }

  await schemaPromise;
}

export async function insertSubmission({ token, displayName, statements, lieIndex, ipAddress }) {
  await ensureSchema();

  const result = await sql`
    INSERT INTO truth_lie_entries (
      player_token,
      display_name,
      statement_one,
      statement_two,
      statement_three,
      lie_index,
      created_ip
    )
    VALUES (
      ${token},
      ${displayName},
      ${statements[0]},
      ${statements[1]},
      ${statements[2]},
      ${lieIndex},
      ${ipAddress}
    )
    RETURNING *
  `;

  return mapEntry(result.rows[0]);
}

export async function getSubmissionByToken(token) {
  await ensureSchema();

  const result = await sql`
    SELECT *
    FROM truth_lie_entries
    WHERE player_token = ${token}
    LIMIT 1
  `;

  return mapEntry(result.rows[0]);
}

export async function getQueueAhead(token) {
  await ensureSchema();

  const result = await sql`
    WITH target AS (
      SELECT id, submitted_at
      FROM truth_lie_entries
      WHERE player_token = ${token}
      LIMIT 1
    )
    SELECT COUNT(*)::INT AS count
    FROM truth_lie_entries e
    JOIN target t ON true
    WHERE e.status = 'queued'
      AND (
        e.submitted_at < t.submitted_at
        OR (e.submitted_at = t.submitted_at AND e.id < t.id)
      )
  `;

  return Number(result.rows[0]?.count || 0);
}

export async function countQueued() {
  await ensureSchema();
  const result = await sql`
    SELECT COUNT(*)::INT AS count
    FROM truth_lie_entries
    WHERE status = 'queued'
  `;
  return Number(result.rows[0]?.count || 0);
}

export async function getCurrentRound() {
  await ensureSchema();
  const result = await sql`
    SELECT *
    FROM truth_lie_entries
    WHERE status IN ('active', 'revealed')
    ORDER BY round_started_at DESC NULLS LAST, id DESC
    LIMIT 1
  `;

  return mapEntry(result.rows[0]);
}

export async function getNextQueued() {
  await ensureSchema();

  const result = await sql`
    SELECT *
    FROM truth_lie_entries
    WHERE status = 'queued'
    ORDER BY submitted_at ASC, id ASC
    LIMIT 1
  `;

  return mapEntry(result.rows[0]);
}

export async function listSubmissions() {
  await ensureSchema();

  const result = await sql`
    SELECT *
    FROM truth_lie_entries
    ORDER BY submitted_at ASC, id ASC
  `;

  return result.rows.map(mapEntry);
}

export async function startRound(entryId) {
  await ensureSchema();

  const client = await db.connect();
  try {
    await client.sql`BEGIN`;

    await client.sql`
      UPDATE truth_lie_entries
      SET status = 'archived', archived_at = NOW()
      WHERE status IN ('active', 'revealed')
    `;

    const result = await client.sql`
      UPDATE truth_lie_entries
      SET
        status = 'active',
        round_started_at = NOW(),
        revealed_at = NULL,
        archived_at = NULL
      WHERE id = ${entryId}
        AND status = 'queued'
      RETURNING *
    `;

    if (result.rowCount === 0) {
      await client.sql`ROLLBACK`;
      return null;
    }

    await client.sql`COMMIT`;
    return mapEntry(result.rows[0]);
  } catch (error) {
    try {
      await client.sql`ROLLBACK`;
    } catch {
      // ignore rollback errors
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function revealRound(entryId) {
  await ensureSchema();

  const result = await sql`
    UPDATE truth_lie_entries
    SET status = 'revealed', revealed_at = NOW()
    WHERE id = ${entryId}
      AND status = 'active'
    RETURNING *
  `;

  return mapEntry(result.rows[0]);
}

export async function archiveRound(entryId) {
  await ensureSchema();

  const result = await sql`
    UPDATE truth_lie_entries
    SET status = 'archived', archived_at = NOW()
    WHERE id = ${entryId}
      AND status IN ('active', 'revealed')
    RETURNING *
  `;

  return mapEntry(result.rows[0]);
}
