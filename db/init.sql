CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    status TEXT,
    name TEXT,
    email TEXT,
    phone BIGINT
);