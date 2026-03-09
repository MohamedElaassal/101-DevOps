import { Request, Response } from "express";
import { db } from "../db/connection";

export async function getTools(req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM toolkit ORDER BY domain, rating DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tools" });
  }
}

export async function rateTool(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.query(
      "UPDATE toolkit SET rating = rating + 1 WHERE id = ?",
      [id],
    );
    const [rows] = await db.query("SELECT * FROM toolkit WHERE id = ?", [id]);
    res.json((rows as any)[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to rate tool" });
  }
}
