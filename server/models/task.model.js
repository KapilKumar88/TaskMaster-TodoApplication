const mongoose = require("mongoose");
const { TASK_STATUS, TASK_PRIORITY_TYPES } = require("../constants");

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
      enum: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE, TASK_STATUS.TODO],
      default: TASK_STATUS.TODO,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    priority: {
      type: String,
      required: true,
      enum: [
        TASK_PRIORITY_TYPES.HIGH,
        TASK_PRIORITY_TYPES.LOW,
        TASK_PRIORITY_TYPES.MEDIUM,
      ],
      default: TASK_PRIORITY_TYPES.MEDIUM,
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
