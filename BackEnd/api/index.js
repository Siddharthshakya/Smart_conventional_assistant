import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/chat", chatRoutes);


// MongoDb Connection

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();

/* Export app for Vercel */
export default app;
