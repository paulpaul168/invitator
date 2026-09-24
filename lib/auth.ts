import { timingSafeEqual } from "crypto";
import { getAdminSecret } from "./config";

export function secretsEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function isAdminSecret(secret: string): Promise<boolean> {
  return secretsEqual(secret, await getAdminSecret());
}
