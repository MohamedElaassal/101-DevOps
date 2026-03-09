import { Request, Response } from "express";
import { db } from "../db/connection";

export async function getAllWisdom(req: Request, res: Response) {
  try {
    const [rows] = await db.query("SELECT * FROM wisdom ORDER BY stars DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wisdom entries" });
  }
}

export async function getFeaturedWisdom(req: Request, res: Response) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM wisdom ORDER BY RAND() LIMIT 1",
    );
    res.json((rows as any)[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured wisdom" });
  }
}

export async function starWisdom(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.query(
      "UPDATE wisdom SET stars = stars + 1 WHERE id = ?",
      [id],
    );
    const [rows] = await db.query("SELECT * FROM wisdom WHERE id = ?", [id]);
    res.json((rows as any)[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to star wisdom entry" });
  }
}
