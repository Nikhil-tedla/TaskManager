const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {type:String},
  dueDate: {type:Date,required:true},
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sharedWith:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
const task=mongoose.model('Task', taskSchema);
module.exports = task
