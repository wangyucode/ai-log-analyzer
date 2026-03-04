
import { DuckDBInstance, DuckDBConnection } from '@duckdb/node-api';

let dbInstance: DuckDBInstance | null = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await DuckDBInstance.create('data/ai-log-analyzer.duckdb');
    const connection = await dbInstance.connect();
    await initDB(connection);
    // Note: We keep the connection open implicitly or just let it be garbage collected if not stored?
    // Actually, we are returning the instance. The connection created here is only for initialization.
    // It's good practice to close it if we don't return it.
    // But since DuckDB is in-process, maybe it's fine.
    // However, for cleanliness, let's close it.
    // But wait, does closing the connection affect the instance? No.
    // But does it affect the initialization if async tasks are pending? No, we awaited everything.
    // connection.close(); // Assuming close() exists.
  }
  return dbInstance;
}

async function initDB(conn: DuckDBConnection) {
  await conn.run(`
    CREATE SEQUENCE IF NOT EXISTS log_files_id_seq;
    CREATE TABLE IF NOT EXISTS log_files (
      id INTEGER PRIMARY KEY DEFAULT nextval('log_files_id_seq'),
      file_path TEXT NOT NULL,
      table_name TEXT,
      parser_script TEXT,
      last_read_offset UBIGINT,
      create_sql TEXT,
      insert_sql TEXT,
      retention_days INTEGER,
      status TEXT CHECK (status IN ('UNINITIALIZED', 'PARSING', 'READY', 'ERROR')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
