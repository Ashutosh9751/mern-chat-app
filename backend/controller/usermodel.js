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
        // 1. Find the user you are trying to add by phone number
        //here ashu
        const userToAdd = await usermodel.findOne({ phone: phone });
        if (!userToAdd) {
            return res.status(404).json({ message: "User not found" });
        }
//login user is in req.user
        const currentUserId = req.user.id;

        // Don't allow adding self
        if (currentUserId === userToAdd._id.toString()) {
            return res.status(400).json({ message: "You cannot add yourself as a friend." });
        }

        // 2. Add userToAdd to currentUser's friends list
        const updatedCurrentUserFriends = await friendsmodel.findOneAndUpdate(
            { userId: currentUserId },
            {
                $addToSet: {
                    friends: {
                        user: userToAdd._id,
                        customname: customname // custom name from current user
                    }
                }
            },
            { new: true, upsert: true }
        );

        // 3. Add currentUser to userToAdd's friends list
        const currentUser = await usermodel.findById(currentUserId);
        const updateInFriendSide = await friendsmodel.findOneAndUpdate(
            { userId: userToAdd._id },
            {
                $addToSet: {
                    friends: {
                        user: currentUserId,
                        customname: currentUser.name // default to your real name or phone, not custom
                    }
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            message: "User added as friend successfully",
            youAdded: { user: userToAdd, customname },
            theySeeYouAs: { user: currentUser, customname: currentUser.name },
            yourFriendsList: updatedCurrentUserFriends
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
