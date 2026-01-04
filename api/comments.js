import { pool } from "../db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { postId } = req.query;

    const { rows } = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at",
      [postId]
    );

    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { postId, text } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO comments (post_id, text) VALUES ($1, $2) RETURNING *",
      [postId, text]
    );

    return res.status(201).json(rows[0]);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
