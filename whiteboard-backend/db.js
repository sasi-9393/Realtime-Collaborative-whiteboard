const mongoose = require("mongoose");

const connectionString = "mongodb+srv://mvskumar9393_db_user:skXfRL2vYljmwTUp@cluster0.ow4vgnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

async function connectToDb() {
    try {
        await mongoose.connect(connectionString, connectionParams);
        console.log("connected")
    }
    catch (err) {
        console.log("DB Connection is failed", err);
    }
}

module.exports = connectToDb;