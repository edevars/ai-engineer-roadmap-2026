export type Env = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
  };
  Variables: {
    user: AuthUser;
  };
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};
