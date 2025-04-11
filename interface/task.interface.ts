import mongoose, { Document } from "mongoose";
import { TaskPriorityTypeEnum, TaskStatusTypeEnum } from "../enum/task.enum";

export interface ITask {
    taskCode: string,
    title: string,
    description: string,
    project: mongoose.Types.ObjectId,
    workspace: mongoose.Types.ObjectId,
    status: TaskStatusTypeEnum,
    priority: TaskPriorityTypeEnum,
    assignedTo: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    dueDate: Date
}