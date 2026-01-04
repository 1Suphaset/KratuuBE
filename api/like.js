import { pool } from "../db.js";

export default async function handler(req, res) {
  const { id, type } = req.query;

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  const column = type === "like" ? "likes" : "dislikes";

  const { rows } = await pool.query(
    `UPDATE posts SET ${column} = ${column} + 1 WHERE id = $1 RETURNING *`,
    [id]
  );

  res.status(200).json(rows[0]);
}
