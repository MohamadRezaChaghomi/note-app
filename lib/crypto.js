import crypto from "crypto";

export function randomToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export function generateNumericCode(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}