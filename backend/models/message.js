import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

const Messagemodel = mongoose.model("Message", messageSchema);
export default Messagemodel;