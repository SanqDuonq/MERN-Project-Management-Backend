import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user.interface";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        select: false
    },
    profilePicture: {
        type: String,
        default: null
    },
    currentWorkspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {collection: 'User', timestamps: true});

const User = mongoose.model('User', UserSchema);
export default User;
