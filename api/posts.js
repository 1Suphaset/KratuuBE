import { pool } from "../db.js";

export default async function handler(req, res) {
  const { method, query, body } = req;
  const id = query.id;

  try {
    // ======================
    // GET /posts
    // ======================
    if (method === "GET") {
      const { rows } = await pool.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
      );
      return res.status(200).json(rows);
    }

    // ======================
    // POST /posts
    // ======================
    if (method === "POST") {
      const { title, content } = body;

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
      }

      const { rows } = await pool.query(
        "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
        [title, content]
      );

      return res.status(201).json(rows[0]);
    }

    // ======================
    // PUT /posts/:id
    // ======================
    if (method === "PUT") {
      if (!id) {
        return res.status(400).json({ message: "Post ID required" });
      }

      const { title, content } = body;

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
      }

      const { rows } = await pool.query(
        "UPDATE posts SET title=$1, content=$2 WHERE id=$3 RETURNING *",
        [title, content, id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(rows[0]);
    }

    // ======================
    // DELETE /posts/:id
    // ======================
    if (method === "DELETE") {
      if (!id) {
        return res.status(400).json({ message: "Post ID required" });
      }

      const { rowCount } = await pool.query(
        "DELETE FROM posts WHERE id=$1",
        [id]
      );

      if (rowCount === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted successfully" });
    }

    // ======================
    // METHOD NOT ALLOWED
    // ======================
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
