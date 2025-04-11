import mongoose from "mongoose";

export interface IMember {
    userId: mongoose.Types.ObjectId,
    workspaceId: mongoose.Types.ObjectId,
    joinAt: Date
}