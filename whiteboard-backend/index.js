require("dotenv").config();
const express = require("express");
const connectToDb = require("./db");
const userRoutes = require("./routes/userRoutes");
const getAllCanvasRoutes = require("./routes/canvasRoutes");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
    origin: "*",
}));
app.use(express.json());

connectToDb();

app.use("/api/users", userRoutes);
app.use("/canvases", getAllCanvasRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return null;
    }
};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins a canvas room
    socket.on("join-canvas", (data) => {
        const { canvasId, token } = data;
        const decoded = verifyToken(token);

        if (!decoded) {
            socket.emit("error", { message: "Unauthorized" });
            return;
        }

        socket.join(canvasId);
        socket.userId = decoded.userId;
        socket.email = decoded.email;
        socket.name = decoded.name;
        socket.canvasId = canvasId;

        console.log(`${decoded.name} joined canvas: ${canvasId}`);

        // Notify others that a user joined
        socket.to(canvasId).emit("user-joined", {
            name: decoded.name,
            email: decoded.email
        });
    });

    // Broadcast element changes to all users in the canvas room
    socket.on("update-elements", (data) => {
        const { canvasId, elements } = data;

        // Send to all users in this canvas except the sender
        socket.to(canvasId).emit("elements-updated", {
            elements,
            updatedBy: socket.name
        });

        console.log(`Elements updated in canvas ${canvasId} by ${socket.name}`);
    });

    // User leaves canvas
    socket.on("disconnect", () => {
        const canvasId = socket.canvasId;
        console.log(`User disconnected: ${socket.id}`);

        if (canvasId) {
            socket.to(canvasId).emit("user-left", {
                name: socket.name,
                email: socket.email
            });
        }
    });
});

server.listen(5000, () => {
    console.log("server is listening on port 5000");
});