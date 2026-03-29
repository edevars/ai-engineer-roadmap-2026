import type { Database } from "../db";
import * as UserModel from "../models/user";
import { hashPassword, verifyPassword } from "../lib/password";
import { signToken } from "../lib/jwt";

export async function register(
  db: Database,
  jwtSecret: string,
  input: { email: string; password: string; name: string },
) {
  const existing = await UserModel.findByEmail(db, input.email);
  if (existing) {
    return { conflict: true } as const;
  }

  const id = crypto.randomUUID();
  const { hash, salt } = await hashPassword(input.password);
  await UserModel.create(db, { id, email: input.email, name: input.name, password: hash, salt });

  const user = { id, email: input.email, name: input.name };
  const token = await signToken(user, jwtSecret);
  return { token, user };
}

export async function login(
  db: Database,
  jwtSecret: string,
  input: { email: string; password: string },
) {
  const row = await UserModel.findByEmail(db, input.email);
  if (!row) return null;

  const valid = await verifyPassword(input.password, row.password, row.salt);
  if (!valid) return null;

  const user = { id: row.id, email: row.email, name: row.name };
  const token = await signToken(user, jwtSecret);
  return { token, user };
}

export async function getProfile(db: Database, userId: string) {
  return UserModel.findById(db, userId);
}
