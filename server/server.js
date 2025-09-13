import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import leadRouter from "./routes/leads.route.js"

dotenv.config({
  path: "./.env",
});

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/lead-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/leads', leadRouter);

// Server status
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// check server
app.get("/", (req, res) => {
  res.send(
    `<h1>Server is running at http://localhost:${process.env.PORT}</h1>`
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});