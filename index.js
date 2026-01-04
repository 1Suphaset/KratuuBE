import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
