const mongoose = require("mongoose");
const {nanoid} = require("nanoid");
const config = require("./config");
const User = require("./models/User");
const Message = require("./models/Message");

mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true});

const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("messages");
        await db.dropCollection("users");
    } catch (e) {
        console.log("Collection were not presented!");
    }

    const [user, user1] = await User.create({
        username: "user",
        password: "123",
        token: nanoid(),
    }, {
        username: "user1",
        password: "123",
        token: nanoid(),
    });

    db.close();
});