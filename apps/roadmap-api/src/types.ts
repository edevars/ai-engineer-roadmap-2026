import type { Database } from "./db";

export type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
  Variables: {
    user: AuthUser;
    db: Database;
  };
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};
