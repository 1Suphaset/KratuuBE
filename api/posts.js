import { pool } from "../db.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method, query, body } = req;
  const id = query.id;

  try {
    if (method === "GET") {
      const { rows } = await pool.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
      );
      return res.status(200).json(rows);
    }

    if (method === "POST") {
      const { title, content } = body;
      const { rows } = await pool.query(
        "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
        [title, content]
      );
      return res.status(201).json(rows[0]);
    }

    if (method === "PUT") {
      const { title, content } = body;
      const { rows } = await pool.query(
        "UPDATE posts SET title=$1, content=$2 WHERE id=$3 RETURNING *",
        [title, content, id]
      );
      return res.status(200).json(rows[0]);
    }

    if (method === "DELETE") {
      await pool.query("DELETE FROM posts WHERE id=$1", [id]);
      return res.status(200).json({ message: "Deleted" });
    }

    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
