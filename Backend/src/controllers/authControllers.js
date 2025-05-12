const user = require("../models/User");
const dotenv = require('dotenv');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
dotenv.config();
const gentoken=(uid)=>{
    return jwt.sign({id:uid},process.env.JWT_SECRET,{expiresIn:"7d"});
}
const registerUser=async(req,res)=>{
    try{
        const {name,email,password,adminInviteToken}=req.body;
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({ error: "User Email already exists" });
        }
        let role="member"
        if(adminInviteToken && process.env.ADMIN_INVITE_TOKEN==adminInviteToken){
            role="admin"
        }
       const salt=await bcrypt.genSalt(10);
       const hpswd=await bcrypt.hash(password,salt);
       const result = await user.create({
        email,
        name,
        password:hpswd,
        role,
        })
        res.status(201).json({
            _id:result._id,
            name:result.name,
            role:result.role,
            email:result.email,
            token:gentoken(result._id),

        })

    }
    catch(err){
        res.status(500).json({message:"Server Error",
            error:err.message
        });
    }
}
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser = await user.findOne({email});
        if (!existingUser) {
            return res.status(401).json({ "message":"Invalid mail or password" });
        }
        const match=await bcrypt.compare(password,existingUser.password);
        if(!match){
            return res.status(401).json({
                message:"Invalid mail or password"
            })
        }
        res.json({
            _id:existingUser._id,
            name:existingUser.name,
            role:existingUser.role,
            email:existingUser.email,
            token:gentoken(existingUser._id),
        })

    }
    catch(err){
        res.status(500).json({message:"Server Error"});
    }
}
const getuserProfile=async(req,res)=>{
    try{
        
        const existingUser = await user.findById(req.user.id).select("-password");
        if (!existingUser) {
            return res.status(404).json({ "message":"user not found" });
        }
        res.json(existingUser);
    }
    catch(err){
        res.status(500).json({message:"Server Error"});
    }
}
const updateProfile=async(req,res)=>{
    try{
        const existingUser = await user.findById(req.user.id).select("-password");
        if (!existingUser) {
            return res.status(404).json({ "message":"user not found" });
        }
        existingUser.name=req.body.name;
        existingUser.email=req.body.email;
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            const hpswd=await bcrypt.hash(req.body.password,salt);
            existingUser.password=hpswd;
        }
        const updatedUser=await existingUser.save();

        res.json({
            _id:updatedUser._id,
            name:updatedUser.name,
            role:updatedUser.role,
            email:updatedUser.email,
            token:gentoken(updatedUser._id),
        })

    }
    catch(err){
        res.status(500).json({message:"Server Error"});
    }
}
module.exports={registerUser,loginUser,getuserProfile,updateProfile}