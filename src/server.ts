import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import moduleRoutes from "./routes/rx/module";
import recordRoutes from "./routes/rx/record";


dotenv.config();

const app = express();
const PORT = 3000;


app.use(cors({
  origin: "http://localhost:5173"
}))
// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/rx/module", moduleRoutes);
app.use("/api/rx/record", recordRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
