import { pool } from "../config/db.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken, TokenPayload } from "../utils/jwt.js";
import { AppError } from "../middleware/error.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "PARTICIPANT";
}

interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput) {
  const { rows: existing } = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [input.email]
  );
  if (existing.length > 0) {
    throw new AppError(409, "Email already registered");
  }

  const hashed = await hashPassword(input.password);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [input.name, input.email, hashed, input.role || "PARTICIPANT"]
  );

  const user = rows[0];
  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  return {
    user,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function login(input: LoginInput) {
  const { rows } = await pool.query(
    "SELECT id, name, email, password, role FROM users WHERE email = $1",
    [input.email]
  );
  if (rows.length === 0) {
    throw new AppError(401, "Invalid email or password");
  }

  const user = rows[0];
  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const newPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
  return {
    accessToken: signAccessToken(newPayload),
    refreshToken: signRefreshToken(newPayload),
  };
}

export async function getMe(userId: string) {
  const { rows } = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [userId]
  );
  if (rows.length === 0) throw new AppError(404, "User not found");
  return rows[0];
}
