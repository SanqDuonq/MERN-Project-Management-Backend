import mongoose, { Schema } from "mongoose";
import { IMember } from "../interface/member.interface";

const MemberSchema = new Schema<IMember>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workspace'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },
    joinAt: {
        type: Date,
        default: Date.now
    }
}, {collection: 'Member', timestamps: true})

const Member = mongoose.model('Member', MemberSchema);
export default Member;

