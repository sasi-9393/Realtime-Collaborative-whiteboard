const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");




const userRegister = async function (req, res) {
    const { name, email, password } = req.body;
    try {
        const user = await userModel.register(name, email, password);
        res.status(200).json({
            user,
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }

}

const userLogin = async function (req, res) {
    const { email, password } = req.body;

    try {

        const user = await userModel.login(email, password);
        if (!user) throw Error("Invalid Login Credentials");

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );
        res.status(200).json({
            message: "Login Successful",
            token,
            email: user.email,
            name: user.name
        })
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }

}

const getUserProfile = async function (req, res) {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await userModel.getUser(decoded.email);

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = { userRegister, userLogin, getUserProfile };
