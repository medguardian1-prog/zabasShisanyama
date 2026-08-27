#!/usr/bin/env node
/**
 * Prints a bcrypt hash (cost 12) for the given password.
 * Usage: node scripts/hash-password.mjs 'your-password-here'
 * Put the output in ADMIN_PASSWORD_HASH.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs '<password>'");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log(hash);
