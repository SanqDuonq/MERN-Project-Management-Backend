import mongoose from "mongoose";

export interface IProject {
    name: string, 
    description: string,
    emoji: string,
    workspace: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
}

