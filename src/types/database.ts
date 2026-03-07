export interface DataSource {
  id: number;
  type: string;
  connection_info: string; // JSON string
  name: string;
  database: string;
  table_count: number;
  created_at: string;
}
