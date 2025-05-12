var express=require('express');
const task = require('../models/Task');
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const { getDashboardData, getUserDashboardData, getTasks, createTask, updateTask, deleteTask,  getTaskById } = require('../controllers/TaskControllers');
var taskRoutes=express.Router();
taskRoutes.get("/dashboard-data",protect,getDashboardData)
.get("/user-dashboard-data",protect,getUserDashboardData)
.get("/",protect,getTasks) //admin:all,user:assigned
.get("/:id",protect,getTaskById)
.post("/",protect,adminOnly,createTask)//only by admin
.put("/:id",protect,updateTask)
.delete("/:id",protect,adminOnly,deleteTask) //only by admin




module.exports=taskRoutes;