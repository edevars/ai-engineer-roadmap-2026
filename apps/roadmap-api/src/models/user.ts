import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { users } from "../db/schema";

export async function findByEmail(db: Database, email: string) {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      password: users.password,
      salt: users.salt,
    })
    .from(users)
    .where(eq(users.email, email))
    .get();
}

export async function findById(db: Database, id: string) {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      created_at: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .get();
}

export async function create(
  db: Database,
  data: { id: string; email: string; name: string; password: string; salt: string },
) {
  await db.insert(users).values(data).run();
}
