import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";


import { connectToMongoDB } from "./config/db";
import moduleRoutes from "./routes/rx/module";


dotenv.config();

const app = express();
const PORT = 3000;

connectToMongoDB();

app.use(cors({
  origin: "http://localhost:5173"
}))
// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/rx/module", moduleRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
