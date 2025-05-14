var express=require('express');

const { protect, adminOnly } = require('../Middleware/authMiddleware');
const { getUsers, getUserById, deleteUserById, getSharedTasks } = require('../controllers/userControllers');
var userRoutes=express.Router();

  
userRoutes.get("/",protect,getUsers)
.get("/shared-tasks",protect,getSharedTasks)
.get("/:id",protect,getUserById)
module.exports=userRoutes;
