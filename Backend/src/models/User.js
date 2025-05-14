const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  sharedTasks: [ {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
}, { timestamps: true });
const user = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = user;