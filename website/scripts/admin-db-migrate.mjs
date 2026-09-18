import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing. Add it to .env.local before running this command.");

const schema = await readFile(new URL("../sql/admin-schema.sql", import.meta.url), "utf8");
const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  await sql.unsafe(schema);
  console.log("Bizonix control workspace schema is ready.");
} finally {
  await sql.end({ timeout: 5 });
}
