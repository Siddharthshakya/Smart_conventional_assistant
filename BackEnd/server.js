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

// const MODEL_NAME = "gemini-2.5-flash"; 
// const BASE_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/";


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// const getApiUrl = () => {
//   const apiKey = process.env.GOOGLE_API_KEY;
//   if (!apiKey) {
//     throw new Error("GEMINI_API_KEY environment variable is not set.");
//   }
//   return `${BASE_GEMINI_URL}${MODEL_NAME}:generateContent?key=${apiKey}`;
// };

// app.use(express.json());
// app.use(cors());

// app.post("/test", async (req, res) => {
//   const userMessage = req.body.message;
  
//   if (!userMessage) {
//     return res.status(400).send({ error: "Missing 'message' in request body. Please send a message." });
//   }

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: userMessage }],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(getApiUrl(), options);
//     const data = await response.json();

//     if (!response.ok || data.error) {
//         console.error("Gemini API Error:", data.error || data);
//         return res.status(data.error?.code || response.status || 500).send({ 
//             error: "Gemini API request failed.", 
//             details: data.error || data
//         });
//     }

//     const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (generatedText) {
//       res.send(generatedText);
//     } else {
//       console.warn("Gemini response lacked text content:", data);
//       res.status(500).send({ error: "Gemini API did not return a valid text response, possibly due to safety settings." });
//     }
    
//   } catch (err) {
//     console.error("General Fetch or API Setup Error:", err);
//     res.status(500).send({ 
//       error: "An unexpected error occurred while processing the request.", 
//       details: err.message 
//     });
//   }
// });



