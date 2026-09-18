import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import postgres from "postgres";

const scrypt = promisify(scryptCallback);
const databaseUrl = process.env.DATABASE_URL;
const username = process.env.ADMIN_INITIAL_USERNAME?.trim().toLocaleLowerCase("en-US");
const password = process.env.ADMIN_INITIAL_PASSWORD;

if (!databaseUrl || !username || !password) {
  throw new Error("DATABASE_URL, ADMIN_INITIAL_USERNAME and ADMIN_INITIAL_PASSWORD are required.");
}
if (username.length < 3 || password.length < 12) {
  throw new Error("Use a username of at least 3 characters and a password of at least 12 characters.");
}

const salt = randomBytes(16);
const derived = await scrypt(password, salt, 64);
const passwordHash = `scrypt-v1$${salt.toString("base64url")}$${Buffer.from(derived).toString("base64url")}`;
const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  const created = await sql`
    insert into admin_users (id, username, password_hash)
    values (${randomUUID()}, ${username}, ${passwordHash})
    on conflict (username) do nothing
    returning username
  `;
  console.log(created.length ? `Created control user ${created[0].username}.` : "That control username already exists; no password was changed.");
} finally {
  await sql.end({ timeout: 5 });
}
