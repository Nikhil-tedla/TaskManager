const express=require('express');
const { protect } = require('../Middleware/authMiddleware');
const { getuserProfile, registerUser, loginUser, updateProfile } = require('../controllers/authControllers');
const router=express.Router();
router.post("/register",registerUser)
.post("/login",loginUser)
.get("/profile",protect,getuserProfile)
.put("/profile",protect,updateProfile);
module.exports=router;