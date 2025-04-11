import mongoose from "mongoose";

export interface IWorkspace {
    name: string,
    description: string,
    owner: mongoose.Types.ObjectId,
    invitedCode: string
}