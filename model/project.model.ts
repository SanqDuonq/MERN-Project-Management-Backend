import mongoose, { Schema } from "mongoose";
import { IProject } from "../interface/project.interface";

const ProjectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    emoji: {
        type: String,
        required: false,
        trim: true,
        default: '🖼️'
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Workspace'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {collection: 'Project', timestamps: true});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;