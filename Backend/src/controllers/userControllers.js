const user = require("../models/User");
const task=require("../models/Task");
const dotenv = require('dotenv');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const getUsers=async(req,res)=>{
    try{
        const users=await user.find({role:"member"}).select("-password");
        
        
        const userswithTaskCounts=await Promise.all(
            users.map(async(u)=>{
                const pendingTasks=await task.countDocuments({
                    assignedTo:u._id,
                    status:"Pending"
                })
                const InProgressTasks=await task.countDocuments({
                    assignedTo:u._id,
                    status:"In Progress"
                })
                const completedTasks=await task.countDocuments({
                    assignedTo:u._id,
                    status:"Completed"
                })
                return {
                    ...u._doc,
                    pendingTasks,
                    InProgressTasks,
                    completedTasks
                }
            })
        )
        res.json(userswithTaskCounts)

    }
    catch(err){
        res.status(500).json(
            {   message:"Internal serve error",
                error:err.message,

            }
        )
    }
}
const getUserById=async(req,res)=>{
    try{
        const u=await user.findById(req.params.id).select("-password");
        if(!u)res.status(404).json(
            {
                message:"no user found",
                
            }
        )
        res.json(u);    
    }
    catch(err){
        res.status(500).json(
            {   message:"Internal server error",
                error:err.message,

            }
        )
    }
}

const getSharedTasks = async (req, res) => {
    try {
      const userId = req.user.id;
  
      
    //   const users = await user.findById(userId).populate({
    //     path: 'sharedTasks', 
    //     populate: [
    //         {
    //           path: 'assignedTo', 
    //           select: 'name' 
    //         },
            
    //       ]
    //   });
    const users = await user.findById(userId).populate({
        path: 'sharedTasks.taskId',
        populate: {
          path: 'assignedTo',
          select: 'name'
        }
      }).populate({
        path: 'sharedTasks.sharedBy',
        select: 'name email'
      });
      
      
      
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
     
  
      res.json(users.sharedTasks);
  
      
    } catch (error) {
      console.error("Error fetching shared tasks:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
module.exports={getUserById,getUsers,getSharedTasks}
