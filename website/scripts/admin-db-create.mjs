import postgres from "postgres";

const adminUrl = process.env.POSTGRES_ADMIN_URL;
const databaseName = process.env.ADMIN_DATABASE_NAME ?? "bizonix_control";

if (!adminUrl) throw new Error("POSTGRES_ADMIN_URL is missing. Use a connection string to the existing postgres database.");
if (!/^[a-z][a-z0-9_]{0,62}$/.test(databaseName)) {
  throw new Error("ADMIN_DATABASE_NAME must begin with a letter and contain only lowercase letters, numbers and underscores.");
}

const sql = postgres(adminUrl, { max: 1, prepare: false });
try {
  const exists = await sql`select 1 from pg_database where datname = ${databaseName}`;
  if (exists.length) {
    console.log(`Database ${databaseName} already exists.`);
  } else {
    // The name is constrained above before it becomes an identifier.
    await sql.unsafe(`create database "${databaseName}"`);
    console.log(`Created database ${databaseName}.`);
  }
} finally {
  await sql.end({ timeout: 5 });
}
