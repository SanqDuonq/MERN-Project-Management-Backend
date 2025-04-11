import mongoose, { Schema } from "mongoose";
import { ITask } from "../interface/task.interface";
import generateTask from "../util/generate-task";
import { TaskPriorityEnum, TaskStatusEnum } from "../enum/task.enum";

const TaskSchema = new Schema<ITask>({
    taskCode: {
        type: String,
        required: true,
        default: generateTask
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workspace'
    },
    status: {
        type: String,
        enum: Object.values(TaskStatusEnum),
        default: TaskStatusEnum.TODO
    },
    priority: {
        type: String,
        enum: Object.values(TaskPriorityEnum),
        default: TaskPriorityEnum.MEDIUM
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        default: null
    }
}, {collection: 'Task', timestamps: true});

const Task = mongoose.model('Task', TaskSchema);
export default Task;