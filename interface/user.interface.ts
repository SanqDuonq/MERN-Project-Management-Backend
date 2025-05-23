import mongoose from "mongoose";

export interface IUser {
    name: string,
    email: string,
    password?: string,
    profilePicture?: string,
    isActive: boolean,
    lastLogin: Date,
    currentWorkspace: mongoose.Types.ObjectId | null
}