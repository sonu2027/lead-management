import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import leadRouter from "./routes/leads.route.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());

const DB_NAME = "personal-finance-manager";
const MONGO_URL = process.env.DB_URL
  ? `${process.env.DB_URL}/${DB_NAME}`
  : process.env.LOCAL_DB_URL;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/leads", leadRouter);

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/", (req, res) => {
  res.send("<h1>Server is running!</h1>");
});

if (process.env.NODE_ENV !== "vercel") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;
