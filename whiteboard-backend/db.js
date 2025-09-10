const mongoose = require("mongoose");





const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function connectToDb() {
    try {
        await mongoose.connect(process.env.connectionString, connectionParams);
        console.log("connected")
    }
    catch (err) {
        console.log("DB Connection is failed", err);
    }
}

module.exports = connectToDb;