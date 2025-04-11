import mongoose, { Schema } from "mongoose";
import { IWorkspace } from "../interface/workspace.interface";
import generateInvited from "../util/generate-invited";

const WorkspaceSchema = new Schema<IWorkspace>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitedCode: {
        type: String,
        required: true,
        unique: true,
        default: generateInvited
    }
}, {collection: 'Workspace', timestamps: true});

const Workspace = mongoose.model('Workspace', WorkspaceSchema);
export default Workspace;