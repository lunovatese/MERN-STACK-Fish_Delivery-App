import User from "../models/User.js";
import bcrypt from "bcrypt"

const changePassword = async(req,res) => {

    try{
        const{userId,oldPassword,newPassword}=req.body;

        const user=await User.findOne({_id:userId})
        if(!user){
            return res.status(404).json({success:false,error :"User not found"})
        }

        const isMatch=await bcrypt.compare(oldPassword,user.password)
        if(!isMatch){
            return res.status(404).json({success:false,error :"Wrong old password"})
        }

        const hashPassword=await bcrypt.hash(newPassword,10)
        
        const newUser=await User.findByIdAndUpdate(userId,{password:hashPassword},{new:true})
        if(!newUser){
            return res.status(404).json({success:false,error :"User not found"})
        }
        return  res.status(200).json({success:true , message:  "Password update successful"}) 
    }
    catch(error){
        return res.status(500).json({success:false,error:"Setting error"})
    }
}
export {changePassword}