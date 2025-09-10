require('dotenv').config();
const express = require("express");
const connectToDb = require("./db");
const userRoutes = require("./routes/userRoutes");
const getAllCanvasRoutes = require("./routes/canvasRoutes");
const authMiddleware = require("./middlewares/authenticationMiddleware");

const cors = require("cors");
const app = express();
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));
app.use(express.json());

connectToDb();


app.use("/api/users", userRoutes);
app.use("/canvases", getAllCanvasRoutes);
app.listen(5000, function () {
    console.log("server is listening");
    //console.log(process.env.JWT_SECRET_KEY)
})