const router = require("express").Router();
const Message = require('../models/Message')
const User = require('../models/User');
const activeConnections = {};

router.ws("/", async (ws, res) => {
    const id = res.query.token;
    activeConnections[id] = ws;

    let query;
    query = {token: id}
    const newUser = await User.find(query);
    const username = newUser[0].username

    ws.on("message", async msg => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case "GET_ALL_MESSAGES":
                const result = await Message.find();
                if (result) {
                    if (result.lenght > 30) {
                        ws.send(JSON.stringify({type: "ALL_MESSAGES", result: result.slice(-30)}));
                    } else {
                        ws.send(JSON.stringify({type: "ALL_MESSAGES", result}));
                    }
                } else {
                    ws.send(JSON.stringify({type: "ERROR"}));
                }
                break;
            case "CREATE_MESSAGE":
                let messageData = {};
                messageData.text = decodedMessage.message;
                messageData.user = newUser[0]._id;
                messageData.username = newUser[0].username;
                const newMessage = new Message(messageData);
                try {
                    await newMessage.save();
                } catch (e) {
                    console.log(e);
                }
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    conn.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        username,
                        text: decodedMessage.message
                    }));
                });
                break;
            default:
                console.log("Unknown message type:", decodedMessage.type);
        }
    });

    ws.on("close", msg => {
        // console.log("Client disconnected! id =", id);
        delete activeConnections[id];
    });
});

module.exports = router;