import crypto from "crypto";

export function randomToken(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
