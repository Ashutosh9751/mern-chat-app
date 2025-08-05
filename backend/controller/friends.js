import friendsmodel from "../models/friends.js";
import usermodel from "../models/usermodel.js";
import mongoose from "mongoose";
export const getFriends = async (req, res) => {
const userId =req.user.id; // Assuming user ID is stored in req.user

    const objectId = new mongoose.Types.ObjectId(String(userId));


   
const user = await friendsmodel
  .findOne({ userId: objectId })
  .populate({
    path: 'friends.user',
    select: 'username dp'
  });

    if (!user) {
        await friendsmodel.create({
            userId,
  
        })
        res.json({ message: "created your new id " })
    }
    else {
      
        if (user.friends.length == 0) {
            res.json({ message: "you have no friends yet" });
        } else {
            res.json(user);
        }
    }
    
}