-- ============================================================
-- Pessaro Trading Portal — Schema inicial
-- Branch: trading-portal-dev (sgkuhtpkmjoqkenqgowl)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ── ACCOUNTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tp_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number  TEXT NOT NULL UNIQUE,
  account_type    TEXT NOT NULL DEFAULT 'real' CHECK (account_type IN ('real','demo')),
  currency        TEXT NOT NULL DEFAULT 'USD',
  leverage        TEXT DEFAULT '1:100',
  balance         NUMERIC(14,2) NOT NULL DEFAULT 0,
  equity          NUMERIC(14,2) NOT NULL DEFAULT 0,
  margin_used     NUMERIC(14,2) NOT NULL DEFAULT 0,
  free_margin     NUMERIC(14,2) NOT NULL DEFAULT 0,
  margin_level    NUMERIC(10,2) NOT NULL DEFAULT 0,
  floating_pnl    NUMERIC(14,2) NOT NULL DEFAULT 0,
  initial_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  broker          TEXT DEFAULT 'Pessaro Capital',
  server          TEXT DEFAULT 'MT4-Live',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── TRADES (historial cerrado) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tp_trades (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id      UUID NOT NULL REFERENCES tp_accounts(id) ON DELETE CASCADE,
  ticket          BIGINT,
  symbol          TEXT NOT NULL,
  position_type   TEXT NOT NULL CHECK (position_type IN ('BUY','SELL')),
  lots            NUMERIC(10,4) NOT NULL,
  open_price      NUMERIC(14,5) NOT NULL,
  close_price     NUMERIC(14,5) NOT NULL,
  stop_loss       NUMERIC(14,5),
  take_profit     NUMERIC(14,5),
  profit_loss     NUMERIC(14,2) NOT NULL DEFAULT 0,
  commission      NUMERIC(10,2) DEFAULT 0,
  swap            NUMERIC(10,2) DEFAULT 0,
  open_time       TIMESTAMPTZ NOT NULL,
  close_time      TIMESTAMPTZ NOT NULL,
  duration_mins   INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (close_time - open_time)) / 60
  )::INTEGER STORED,
  running_balance NUMERIC(14,2),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── OPEN POSITIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tp_open_positions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id      UUID NOT NULL REFERENCES tp_accounts(id) ON DELETE CASCADE,
  ticket          BIGINT,
  symbol          TEXT NOT NULL,
  position_type   TEXT NOT NULL CHECK (position_type IN ('BUY','SELL')),
  lots            NUMERIC(10,4) NOT NULL,
  open_price      NUMERIC(14,5) NOT NULL,
  current_price   NUMERIC(14,5),
  stop_loss       NUMERIC(14,5),
  take_profit     NUMERIC(14,5),
  profit_loss     NUMERIC(14,2) DEFAULT 0,
  swap            NUMERIC(10,2) DEFAULT 0,
  open_time       TIMESTAMPTZ NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── EQUITY SNAPSHOTS (curva diaria) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS tp_equity_snapshots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id  UUID NOT NULL REFERENCES tp_accounts(id) ON DELETE CASCADE,
  snapshot_at DATE NOT NULL,
  balance     NUMERIC(14,2) NOT NULL,
  equity      NUMERIC(14,2) NOT NULL,
  floating    NUMERIC(14,2) DEFAULT 0,
  UNIQUE (account_id, snapshot_at)
);

-- ── OHLC PRICE DATA ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tp_ohlc (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  symbol    TEXT NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '1h',
  time      TIMESTAMPTZ NOT NULL,
  open      NUMERIC(14,5) NOT NULL,
  high      NUMERIC(14,5) NOT NULL,
  low       NUMERIC(14,5) NOT NULL,
  close     NUMERIC(14,5) NOT NULL,
  volume    NUMERIC(20,2) DEFAULT 0,
  UNIQUE (symbol, timeframe, time)
);

-- ── INDEXES ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tp_trades_account    ON tp_trades(account_id, close_time DESC);
CREATE INDEX IF NOT EXISTS idx_tp_trades_symbol     ON tp_trades(symbol);
CREATE INDEX IF NOT EXISTS idx_tp_trades_user       ON tp_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_tp_positions_account ON tp_open_positions(account_id);
CREATE INDEX IF NOT EXISTS idx_tp_ohlc_symbol_tf    ON tp_ohlc(symbol, timeframe, time DESC);
CREATE INDEX IF NOT EXISTS idx_tp_equity_account    ON tp_equity_snapshots(account_id, snapshot_at DESC);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE tp_accounts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_trades            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_open_positions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_equity_snapshots  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_ohlc              ENABLE ROW LEVEL SECURITY;

-- Accounts: users see only their own
CREATE POLICY "own_accounts" ON tp_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Trades: users see only their own
CREATE POLICY "own_trades" ON tp_trades
  FOR ALL USING (auth.uid() = user_id);

-- Positions: users see only their own
CREATE POLICY "own_positions" ON tp_open_positions
  FOR ALL USING (auth.uid() = user_id);

-- Equity: users see only their own
CREATE POLICY "own_equity" ON tp_equity_snapshots
  USING (account_id IN (SELECT id FROM tp_accounts WHERE user_id = auth.uid()));

-- OHLC: public read, write only via service_role
CREATE POLICY "read_ohlc" ON tp_ohlc
  FOR SELECT USING (true);

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER trg_accounts_updated
  BEFORE UPDATE ON tp_accounts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── REALTIME ──────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE tp_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE tp_open_positions;

-- ── SEED: demo account ────────────────────────────────────────────────────
-- (Opcional: insertar datos demo para pruebas sin auth)
-- INSERT INTO tp_accounts (user_id, account_number, balance, equity, initial_balance)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'MT4-284751', 24850, 25312.4, 22000);
