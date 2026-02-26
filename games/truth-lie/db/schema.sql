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
);

CREATE INDEX IF NOT EXISTS truth_lie_entries_status_submitted_idx
ON truth_lie_entries (status, submitted_at, id);

CREATE INDEX IF NOT EXISTS truth_lie_entries_submitted_idx
ON truth_lie_entries (submitted_at, id);
