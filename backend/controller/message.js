
import Messagemodel from "../models/message.js";



export const getmessages = async (req, res) => {
    const { senderid, receiverid } = req.body;
  
    if (!senderid || !receiverid) {
        return res.status(400).json({ error: "Sender ID and Receiver ID are required" });
    }
    try {
        const messages = await Messagemodel.find({
            $or: [
                { sender: senderid, receiver: receiverid },
                { sender: receiverid, receiver: senderid }
            ]
        }).sort({ createdAt: 1 })
           
        // Sort by creation date in ascending order
        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}