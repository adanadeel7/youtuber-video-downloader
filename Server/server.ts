import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.ts";
import authRoutes from "./Routes/auth.routes.ts";
import videoRoutes from "./Routes/video.routes.ts";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 8000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Api is Running'
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/video", videoRoutes);

// Start Server
const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

server.on("error", (err: any) => {
    console.error("Server startup error:", err);
});