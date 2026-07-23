import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import workoutRoutes from "./routes/workouts.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/workouts", workoutRoutes);

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    message: "IronLog API is running",
  });
});

app.listen(port, () => {
  console.log(`IronLog API running on port ${port}`);
});