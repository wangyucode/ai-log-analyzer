import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const decodedFile = decodeURIComponent(file);

  try {
    const db = await getDB();
    const conn = await db.connect();
    try {
      // Escape single quotes to prevent SQL injection in this simple case
      const escapedFile = decodedFile.replace(/'/g, "''");
      const result = await conn.run(
        `SELECT * FROM log_files WHERE file = '${escapedFile}'`,
      );
      const rows = await result.getRows();

      if (rows.length === 0) {
        return NextResponse.json({ info: null });
      }

      // Convert result to plain object as DuckDB result might have special types
      const info = JSON.parse(
        JSON.stringify(rows[0], (_, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      );

      return NextResponse.json({ info });
    } finally {
      // Assuming close exists based on comments in db.ts
      try {
        if (typeof (conn as any).close === "function") {
          await (conn as any).close();
        }
      } catch (_e) {
        // Ignore close errors
      }
    }
  } catch (error) {
    console.error("Error fetching log info:", error);
    return NextResponse.json(
      { error: "Failed to fetch log info" },
      { status: 500 },
    );
  }
}
