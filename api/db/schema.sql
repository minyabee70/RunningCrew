CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  trial_started_at TIMESTAMPTZ,
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'trial',
  subscription_expires_at TIMESTAMPTZ,
  pg_customer_id VARCHAR(255),
  pg_subscription_id VARCHAR(255),
  language VARCHAR(5) NOT NULL DEFAULT 'ko',
  ui_theme VARCHAR(20) NOT NULL DEFAULT 'default',
  font_scale INTEGER NOT NULL DEFAULT 100,
  height_cm NUMERIC(5,1) DEFAULT 175,
  weight_kg NUMERIC(5,1) DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE designated_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  granted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE running_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  distance_meters NUMERIC(10,2) DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  avg_pace_sec_per_km NUMERIC(8,2),
  route_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  calories INTEGER DEFAULT 0,
  heart_rate_avg INTEGER,
  cadence_avg INTEGER,
  vertical_oscillation_avg NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES running_sessions(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL DEFAULT 'summary',
  summary TEXT NOT NULL,
  insights JSONB DEFAULT '{}'::jsonb,
  model_version VARCHAR(50) NOT NULL DEFAULT 'gemini-1.5-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_ai_analysis_session_type_model
  ON ai_analysis (session_id, analysis_type, model_version);

CREATE INDEX idx_sessions_user_id ON running_sessions(user_id);
CREATE INDEX idx_sessions_user_status ON running_sessions(user_id, status);
CREATE INDEX idx_sessions_started_at ON running_sessions(started_at DESC);
CREATE INDEX idx_ai_analysis_session_id ON ai_analysis(session_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON running_sessions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
