const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectID,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

MessageSchema.plugin(idValidator);
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;