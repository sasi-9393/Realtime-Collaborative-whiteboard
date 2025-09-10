const Canvas = require("../models/canvasModel");

const getAllCanvas = async (req, res) => {
    try {
        if (!req.email) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const email = req.email;

        // Fetch all canvases for the user
        const canvases = await Canvas.getAllCanvas(email);

        res.status(200).json({
            success: true,
            canvases
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error occurred",
            error: err.message
        });
    }
};


const createCanvas = async function (req, res) {
    const { name } = req.body;
    try {
        const newCanvas = await Canvas.createCanvas(req.email, name);
        console.log(newCanvas);
        res.status(200).json(newCanvas);
    }
    catch (err) {
        res.status(400).json({
            message: err,
        })
    }

}

const loadCanvas = async function (req, res) {
    try {
        const email = req.email;   // you attached this in auth middleware
        const { id } = req.params;

        const canvas = await Canvas.loadCanvas(email, id);

        if (!canvas) {
            return res.status(404).json({
                success: false,
                message: "Canvas not found",
            });
        }

        res.status(200).json({
            success: true,
            canvas,
        });
    } catch (err) {
        console.error("Error in loadCanvas:", err);
        res.status(400).json({
            success: false,
            message: "Failed to retrieve canvas",
            error: err.message,
        });
    }
};


const updateCanvas = async function (req, res) {
    const email = req.email;
    const id = req.params.id;
    const { elements } = req.body;
    try {
        const canvas = await Canvas.updateCanvas(email, id, elements);
        res.status(200).json(canvas);
    }
    catch (err) {
        res.status(400).json({ message: err })
    }
}

const deleteCanvas = async function (req, res) {
    const email = req.email;
    const id = req.params.id;

    try {
        const canvas = await Canvas.deleteCanvas(email, id);
        res.status(200).send("Deleted Successfully");
    }
    catch (err) {
        res.send(400).json({ message: err });
    }
}
module.exports = { getAllCanvas, createCanvas, loadCanvas, updateCanvas, deleteCanvas }
