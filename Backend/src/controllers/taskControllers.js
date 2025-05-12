const Task = require("../models/Task");
const dotenv = require('dotenv');
const getTasks = async (req, res) => {
    try {
        const { status } = req.query
        let filter = {}
        if (status) {
            filter.status = status
        }
        let tasks;
        if (req.user.role == "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email"
            )
        }
        else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id },).populate(
                "assignedTo",
                "name email"
            )
        }
        const alltasks = await Task.countDocuments(
            req.user.role == "admin" ? {} : { assignedTo: req.user._id }
        )
        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })
        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })
        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })
        res.json({
            tasks,
            statusSummary: {
                all: alltasks,
                pendingTasks: pendingTasks,
                inProgressTasks: inProgressTasks,
                completedTasks: completedTasks
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Internavl server error",
            error: err.message
        })
    }
}
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email"
        )
        if (!task) res.status(404).json({ message: "Task not found" })
        res.json(task);
    }

    catch (err) {
        res.status(500).json({
            message: "Internavl serve error",
            error: err.message
        })
    }
}
const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate, assignedTo } = req.body;
        if (!Array.isArray(assignedTo)) {
            

            res.status(400).json({
                "message": "assigned to must be an array"
            })
        }
        
        
        const task = await Task.create({
            title, description, priority, status, dueDate, assignedTo, createdBy: req.user._id
        })
        res.status(201).json({
            "message": "created task successfully", task
        })
    }
    catch (err) {
        console.log(err.message);
        
        res.status(500).json({
            message: "Internavl server error",
            error: err.message
        })
    }
}
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) res.status(404).json({ message: "Task not found" })
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.status = req.body.status || task.status;
        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                res.status(400).json({ message: "assigned to must be array of Id's" });
            }
            task.assignedTo = req.body.assignedTo;

        }
        const updatedTask = await task.save();
        res.json({ "message": "task updated", updatedTask });

    }

    catch (err) {
        res.status(500).json({
            message: "Internavl server error",
            error: err.message
        })
    }
}
const deleteTask = async (req, res) => {
    try {
        
        const task=await Task.findByIdAndDelete(req.params.id);
        
        
        res.status(200).json({
            message:"Deleted Task Successfully",
            task
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Internavl server error",
            error: err.message
        })
    }
}
const getDashboardData = async (req, res) => {
    try {
        // console.log(req.user._id);
        
        const alltasks = await Task.countDocuments()
        const pendingTasks = await Task.countDocuments({

            status: "Pending",

        })
        const inProgressTasks = await Task.countDocuments({

            status: "In Progress",

        })
        const completedTasks = await Task.countDocuments({

            status: "Completed",

        })
       
        
        const overdueTask = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        })
        const taskStatus = ['Pending', 'In Progress', 'Completed'];
        const taskDistributionRaw = await Task.aggregate(
            [
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },

                    }
                }
            ]
        )
        const taskDistribution = taskStatus.reduce((acc, sts) => {
            const formattedKey = sts.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((i) =>
                i._id === sts)?.count || 0
            return acc;
        }, {})
        taskDistribution["All"] = alltasks
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            const formattedKey = priority.replace(/\s+/g, "");
            acc[formattedKey] = taskPriorityLevelsRaw.find((i) => i._id === priority)?.count || 0;
            return acc;
        }, {});
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            stats: {
                alltasks,
                pendingTasks,
                completedTasks,
                overdueTask,
                inProgressTasks

            },
            charts: {
                taskDistribution,
                taskPriorityLevels,

            },
            recentTasks
        })

    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}
const getUserDashboardData = async (req, res) => {
    try {
        const uid = req.user._id
        console.log(uid);
        
        
        const alltasks = await Task.countDocuments({ assignedTo: uid })
        const pendingTasks = await Task.countDocuments({
            assignedTo: uid,
            status: "Pending",

        })

        const completedTasks = await Task.countDocuments({
            assignedTo: uid,
            status: "Completed",

        })
        const overdueTask = await Task.countDocuments({
            assignedTo: uid,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        })
        const inProgressTasks = await Task.countDocuments({
            assignedTo: uid,
            status: "In Progress",

        })
        
        
        const taskStatusList = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate(
            [   {
                $match:{assignedTo:uid}
            },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },

                    }
                }
            ]
        )
        const taskDistribution = taskStatusList.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((i) => i._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"]=alltasks;
        const taskPriorityList = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: uid } },
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ]);
          
          const taskPriorityLevels = taskPriorityList.reduce((acc, priority) => {
            const formattedKey = priority.replace(/\s+/g, "");
            acc[formattedKey] = taskPriorityLevelsRaw.find((i) => i._id === priority)?.count || 0;
            return acc;
          }, {});
          const recentTasks = await Task.find({ assignedTo: uid })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");
            
            res.status(200).json({
                stats: {
                    alltasks,
                    pendingTasks,
                    completedTasks,
                    inProgressTasks,
                    overdueTask,
    
                },
                charts: {
                    taskDistribution,
                    taskPriorityLevels,
    
                },
                recentTasks
            })
          

    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

module.exports = { getTaskById, getTasks, updateTask, getDashboardData, getUserDashboardData, deleteTask, createTask }

