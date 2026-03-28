import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "../types";

function getSecret(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signToken(user: AuthUser, secret: string): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret(secret));
}

export async function verifyToken(token: string, secret: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, getSecret(secret));
  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
  };
}
