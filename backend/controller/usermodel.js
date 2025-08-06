import usermodel from "../models/usermodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import friendsmodel from "../models/friends.js";



export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });
    if (user) {
        const iscorrectpassword = await bcrypt.compare(password, user.password);
        if (!iscorrectpassword) {
            return res.json({ message: "Invalid credential" });
        }
    
        var token = jwt.sign({ id:user._id }, 'shhhhh');
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.status(200).json({ message: `hii ${user.username}`, user: user, token: token });
    } else {
        res.json({
            message: "User not found please signup"
        });
    }

}
export const register = async (req, res) => {
    const { username, password, email, phone} = req.body;

    const hashpassword = await bcrypt.hash(password, 10)
    
    const isexist = await usermodel.findOne({ email });

    if (isexist) {
        return res.json({
            message: "User already exists please login"
        });
    }
      const dp = req.file?.path || '';
    const user = await usermodel.create({
        username,
        email,
        password: hashpassword,
        phone,
        dp
    })
    if (user) {
        res.json({
            message: "User created successfully",
            user
        });
    } else {
        res.json({
            message: "User creation failed"
        });
    }

}
export const logout= async (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "User logged out successfully"
    });
}
export const adduser = async (req, res) => {
  const { customname, phone } = req.body;

  try {
    const userToAdd = await usermodel.findOne({ phone });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserId = req.user.id;

    if (currentUserId === userToAdd._id.toString()) {
      return res.status(400).json({ message: "You cannot add yourself as a friend." });
    }

    // ✅ Check if the user is already a friend
    const existingFriendDoc = await friendsmodel.findOne({ userId: currentUserId, 'friends.user': userToAdd._id });

    if (existingFriendDoc) {
      return res.status(400).json({ message: "User is already in your friends list." });
    }

    // ✅ Add userToAdd to current user's friend list
    const updatedCurrentUserFriends = await friendsmodel.findOneAndUpdate(
      { userId: currentUserId },
      {
        $addToSet: {
          friends: {
            user: userToAdd._id,
            customname: customname
          }
        }
      },
      { new: true, upsert: true }
    );

    // ✅ Add current user to userToAdd's friend list
    const currentUser = await usermodel.findById(currentUserId);
    await friendsmodel.findOneAndUpdate(
      { userId: userToAdd._id },
      {
        $addToSet: {
          friends: {
            user: currentUserId,
            customname: currentUser.username
          }
        }
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "User added as friend successfully",
      yourFriendsList: updatedCurrentUserFriends
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
