import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import masterRoutes from "./routes/master-routes";
import requirementRoutes from "./routes/requirements";
import dacRoutes from "./routes/dac";
import finalizedRoutes from "./routes/finalized";
import "dotenv/config";
import path from "path";

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    throw error;
  });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/dac", dacRoutes);
app.use("/api/finalized", finalizedRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
