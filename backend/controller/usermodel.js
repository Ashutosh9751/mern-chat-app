import usermodel from "../models/usermodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import friendsmodel from "../models/friends.js";
import transporter from "../config/emailconfig.js";


export const login = async (req, res) => {
   try {
       const {email, password} = req.body;
       if (!email || !password) {
           return res.status(400).json({ message: "All fields are required" });
       }
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

           })
           res.status(200).json({ message: `hii ${user.username}`, user: user, token: token });
       } else {
           res.json({
               message: "User not found please signup"
           });
       }
   } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
   }

}
export const register = async (req, res) => {
   try {
     const { username, password, email, phone} = req.body;
if (!username || !password || !email || !phone) {
       return res.status(400).json({ success: false,
           message: "All fields are required"
       });
   }

    
    const isexist = await usermodel.findOne({ email });

    if (isexist) {
        return res.json({ success: false,
            message: "User already exists please login"
        });
    }
    const hashpassword = await bcrypt.hash(password, 10)

      const dp = req.file?.path || '';
    const user = new usermodel({
        username,
        email,
        password: hashpassword,
        phone,
        dp
    })
    await user.save();
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Our Service",
        text: `Hi ${username},\n\nThank you for registering! We're excited to have you on board.\n\nBest,\nThe Team`
    };
    if (user) {
        await transporter.sendMail(mailOptions);
        res.json({ success: true,
            message: "User created successfully"
        });
    } else {
        res.json({ success: false, message: "User creation failed" });
    }
    
   } catch (error) {
       console.error("Error creating user:", error);
       res.status(500).json({ success: false,
           message: "Internal server error"
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
export const generateotpforforgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.generateotp = Math.floor(100000 + Math.random() * 900000).toString();
    user.generateotptimeout = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    res.json({ success: true, message: "OTP generated successfully" });

    await user.save();
const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${user.generateotp}. It is valid for 10 minutes.`
};
await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export const verifyotpforforgetpassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }
    const user = await usermodel.findOne({ email });
    if (user.generateotp === otp) {
      if (new Date(user.generateotptimeout) < new Date()) {
        return res.status(400).json({ success: false, message: "OTP has expired" });
      }
      user.generateotp =null;
      user.generateotptimeout =null;
      user.verifiedotp = otp;
      user.verifiedotptimeout = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await user.save();
    res.json({ success: true, message: "OTP verified successfully" });
    }
    else{
    res.json({ success: false, message: "Invalid OTP" });
  }
  }
  
  catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const newpassword=async(req,res)=>{
  try {
    const {email, newpassword } = req.body;
    if (!email || !newpassword) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.verifiedotp === "") {
      return res.status(400).json({ success: false, message: "OTP not verified" });
    }
    else if (user.verifiedotptimeout < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }
    else if (user.verifiedotp ) {
  const hashpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashpassword;
    user.generateotp = "";
    user.generateotptimeout = "";
    user.verifiedotp = "";
    user.verifiedotptimeout = "";
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
    }
    
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}