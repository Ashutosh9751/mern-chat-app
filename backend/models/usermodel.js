import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
username:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},

phone:{
    type:String,
    required:true
},
dp:{
    type:String
}, // Add this line for display picture
createdAt:{
    type:Date,
    default:Date.now()
}


})

const usermodel=mongoose.model("user",userSchema)
export default usermodel