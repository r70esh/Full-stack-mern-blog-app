import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connectionDB.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// Health Check Route
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// API ENDPOINTS
app.use("/images", express.static("uploads"));
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// Dynamic Port for Render
const PORT = process.env.PORT || 4000;

// Connect to DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed", err);
});