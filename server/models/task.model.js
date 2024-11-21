const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, "name"],
      max: [200, "name"],
    },
    description: {
      type: String,
      required: false,
      min: [3, "description"],
      max: [500, "description"],
    },
    status: {
      type: String,
      required: true,
      enum: ["in-progress", "done", "todo"],
      default: "todo",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    priority: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("task", taskSchema);
