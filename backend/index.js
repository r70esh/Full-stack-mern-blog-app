import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connectionDB.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";

dotenv.config();
const app = express();

// --- MIDDLEWARES ---
app.use(express.json());

// Updated CORS to allow your specific Vercel URL
app.use(cors({
  origin: "https://full-stack-mern-blog-app-cejy.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- HEALTH CHECK ROUTE ---
// Visiting your Render URL in a browser should show this message
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// --- API ENDPOINTS ---
app.use("/images", express.static("uploads"));
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// --- SERVER INITIALIZATION ---
// Render will provide the PORT via process.env.PORT
const PORT = process.env.PORT || 4000;

// Connect to MongoDB Atlas first, then start listening
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed. Server not started.", err);
  });