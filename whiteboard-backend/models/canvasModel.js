const mongoose = require("mongoose");
const User = require("./userModel")

const canvasSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    elements: [{ type: mongoose.Schema.Types.Mixed }],
    shared_with: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]


}, {
    timestamps: true,
})


canvasSchema.statics.getAllCanvas = async function (email) {
    if (!email) return [];
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) return [];

    const canvases = await this.find({
        $or: [{ owner: user._id }, { shared_with: user._id }]
    });

    return canvases;
};

canvasSchema.statics.loadCanvas = async function (email, id) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("No user exist");
    }

    const canvas = await this.findOne({
        _id: id,
        $or: [{ owner: user._id }, { shared_with: user._id }]
    });

    if (!canvas) {
        throw new Error("Canvas not found");
    }

    return canvas;
};


canvasSchema.statics.createCanvas = async function (email, name) {
    const user = await User.findOne({ email });
    try {
        if (!user) {
            throw Error("User not found")
        }
        const canvas = new this({
            name,
            owner: user._id,
            elements: [],
            shared_with: []
        });
        const newCanvas = await canvas.save();
        return newCanvas;
    }
    catch (err) {
        return new Error(err.message);
    }
}
canvasSchema.statics.updateCanvas = async function (email, id, elements) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found on update");
    }
    const canvas = await this.findOne({
        _id: id,
        $or: [
            { owner: user._id },
            { sharedWith: user._id }
        ]
    });
    if (!canvas) {
        throw new Error("Canvas not found for a user with given id");
    }
    canvas.elements = elements;
    const updatedCanvas = await canvas.save();
    return updatedCanvas;
}

canvasSchema.statics.deleteCanvas = async function (email, id) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found on delete");
    }

    const canvas = await this.findByIdAndDelete(id);
    if (!canvas) {
        throw new Error("Canvas not found for given id");
    }

    return canvas;
};
canvasSchema.statics.shareCanvas = async function (email, canvasId, sharedWithEmail) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    const canvas = await this.findById(canvasId);
    if (!canvas) {
        throw new Error("Canvas not found");
    }

    // Check if user is the owner
    if (canvas.owner.toString() !== user._id.toString()) {
        throw new Error("You can only share your own canvas");
    }

    // Find the user to share with
    const sharedWithUser = await User.findOne({ email: sharedWithEmail });
    if (!sharedWithUser) {
        throw new Error("User with email " + sharedWithEmail + " not found");
    }

    // Prevent self-sharing
    if (user._id.toString() === sharedWithUser._id.toString()) {
        throw new Error("Cannot share canvas with yourself");
    }

    // Check if already shared
    if (canvas.shared_with.includes(sharedWithUser._id)) {
        throw new Error("Canvas already shared with this user");
    }

    // Add to shared_with
    canvas.shared_with.push(sharedWithUser._id);
    const updatedCanvas = await canvas.save();

    return updatedCanvas;
};


const Canvas = mongoose.model("Canvas", canvasSchema);
module.exports = Canvas;
