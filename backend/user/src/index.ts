import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled Error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  },
);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
