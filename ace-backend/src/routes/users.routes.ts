import { Router, Request, Response, NextFunction } from "express";
import { pool } from "../config/db.js";
import { authGuard, adminGuard } from "../middleware/auth.js";

const router = Router();

router.get("/", authGuard, adminGuard, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
