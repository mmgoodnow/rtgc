import { randomBytes } from "node:crypto";

export function getRandomString() {
  return randomBytes(16).toString("hex");
}
