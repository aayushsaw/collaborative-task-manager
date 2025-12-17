import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";






const app = express();


app.get("/", (req, res) => {
  res.send("Server is alive");
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);


export default app;
