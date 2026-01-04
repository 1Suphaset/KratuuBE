import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* GET comments by post */
router.get("/:postId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at ASC",
    [req.params.postId]
  );
  res.json(result.rows);
});

/* CREATE comment */
router.post("/", async (req, res) => {
  const { post_id, text } = req.body;

  const result = await pool.query(
    "INSERT INTO comments (post_id, text) VALUES ($1, $2) RETURNING *",
    [post_id, text]
  );

  res.json(result.rows[0]);
});

/* DELETE comment */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM comments WHERE id=$1", [req.params.id]);
  res.json({ message: "Comment deleted" });
});

export default router;
