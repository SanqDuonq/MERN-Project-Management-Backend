import mongoose from "mongoose";
import { IRole } from "./role.interface";

export interface IMember {
    userId: mongoose.Types.ObjectId,
    workspaceId: mongoose.Types.ObjectId,
    role: IRole,
    joinAt: Date
}