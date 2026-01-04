import { pool } from "../db.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { rows } = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { title, content } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );

    return res.status(201).json(rows[0]);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
