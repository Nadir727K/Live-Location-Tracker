import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";

 

import authRoutes from "./routes/auth-routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
  origin: "http://localhost:8000",
  credentials: true
}));

// Middleware
app.use(express.json());

// AUTH ROUTES
app.use("/auth", authRoutes);

// Health check 
app.get("/health", (req, res) => {
  res.json({ status: "auth server running" });
});

// Start auth server
server.listen(9000, () => {
  console.log("Auth server running on http://localhost:9000");
});