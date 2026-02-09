import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRouter from "./routes/auth";
import { connectKafka } from "./producer";
import { limiter } from "./middleware/ratelimiter";
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectKafka();

// Routes
app.use("/api/auth",limiter, authRouter);


export default app;

