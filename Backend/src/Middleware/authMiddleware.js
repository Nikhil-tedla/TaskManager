const jwt=require('jsonwebtoken');
const user=require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const protect=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(token&& token.startsWith("Bearer")){
            token=token.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await user.findById(decoded.id).select("-password");
            next();

        }
        else{
            res.status(401).json({
                message:"Not authorized,no token"
            })
        }

    }
    catch(error){
        res.status(401).json({
            error:error.message,
            message:"token failed",
        })
    }
}
const adminOnly=async(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    }
    else{
        res.status(403).json({
            
            message:"access denied,admin only",
        })
    }
}
module.exports={adminOnly,protect}