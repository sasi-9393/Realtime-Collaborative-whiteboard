const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    }
}, {
    timestamps: true,
    collection: "users"
}
);


userSchema.statics.register = async function (name, email, password) {
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("password is not strong");
    }
    const user = await this.findOne({ email });
    if (user) {
        throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await this.create({
        name,
        email,
        password: hashedPassword,
    })
    return newUser;
}

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return user;
}
userSchema.statics.getUser = async function (email) {
    const user = await this.findOne({ email });
    if (!user) throw Error("User doesnt exist");
    return user;
}


const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
