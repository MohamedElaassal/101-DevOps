import { Request, Response } from "express";
import { db } from "../db/connection";

export async function getCheckpoints(req: Request, res: Response) {
  try {
    const [rows] = await db.query("SELECT * FROM checkpoints ORDER BY step");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch checkpoints" });
  }
}

export async function updateCheckpoint(req: Request, res: Response) {
  try {
    const { step } = req.params;
    const { done, memo } = req.body;

    const finished_at = done ? new Date() : null;

    await db.query(
      "UPDATE checkpoints SET done = ?, memo = ?, finished_at = ? WHERE step = ?",
      [done, memo, finished_at, step],
    );

    const [rows] = await db.query("SELECT * FROM checkpoints WHERE step = ?", [step]);
    res.json((rows as any)[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update checkpoint" });
  }
}
