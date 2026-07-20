const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
