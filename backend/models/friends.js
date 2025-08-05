import mongoose from "mongoose";
import usermodel from "./usermodel.js";

// Example friends model schema
const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  friends: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      customname: { type: String, default: '' }
    }
  ]
});

const friendsmodel=mongoose.model('friends',friendSchema );
export default friendsmodel;