import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* GET all posts */
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

/* CREATE post */
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
    [title, content]
  );

  res.json(result.rows[0]);
});

/* UPDATE post */
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    "UPDATE posts SET title=$1, content=$2 WHERE id=$3 RETURNING *",
    [title, content, req.params.id]
  );

  res.json(result.rows[0]);
});

/* DELETE post */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [req.params.id]);
  res.json({ message: "Post deleted" });
});

/* LIKE post */
router.post("/:id/like", async (req, res) => {
  const result = await pool.query(
    "UPDATE posts SET likes = likes + 1 WHERE id=$1 RETURNING likes",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

/* DISLIKE post */
router.post("/:id/dislike", async (req, res) => {
  const result = await pool.query(
    "UPDATE posts SET dislikes = dislikes + 1 WHERE id=$1 RETURNING dislikes",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

export default router;
