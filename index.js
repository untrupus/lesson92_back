const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
require("express-ws")(app);

const users = require("./app/users");
const chat = require("./app/chat");

const config = require("./config");
const port = 8000;

app.use(cors());
app.use(express.json());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const run = async () => {
    await mongoose.connect(config.db.url + "/" + config.db.name, options);
    app.use("/users", users);
    app.use("/chat", chat);
    console.log("Connected");
    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run().catch(console.error);