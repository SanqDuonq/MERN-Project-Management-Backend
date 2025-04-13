import User from "../model/user.model";
import throwError from "../util/throw-error";
import { RoleEnum } from '../enum/role.enum';
import Role from "../model/role-permission.model";
import Workspace from "../model/workspace.model";
import Member from "../model/member.model";
import mongoose from "mongoose";

class WorkspaceServices {
    private async checkUser(userId: string) {
        const user = await User.findById(userId)
        if (!user) {
            throwError(404, 'User not found');
        }
        return user;
    }

    private async checkRole(roleName: string) {
        const roleOwner = await Role.findOne({name: roleName})
        if (!roleOwner) {
            throwError(404, 'Owner role not found')
        }
        return roleOwner;
    }

    private async checkWorkspace(workspaceId: string) {
        const workspace = await Workspace.findById(workspaceId);
        if(!workspace) {
            throwError(404, 'Workspace not found');
        }
        return workspace;
    }

    async createWorkspace(userId: string, data: {name: string, description?: string}) {
        const user = await this.checkUser(userId);
        const roleOwner = await this.checkRole(RoleEnum.OWNER);
        const workspace = await Workspace.create({
            name: data.name,
            description: data.description,
            owner: user?._id
        })
        await Member.create({
            userId: user?._id,
            workspaceId: workspace._id,
            role: roleOwner!._id,
            joinAt: new Date()
        })
        user!.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user!.save();
        return { workspace };
    }

    async getAllWorkspace(userId: string) {
        const membership = await Member.find({userId})
            .populate('workspaceId')
            .select('-password')
            .exec()
        const workspaces = membership.map((membership) => membership.workspaceId);
        return { workspaces }; 
    }

    async getWorkspaceById(workspaceId: string) {
        const workspace = await this.checkWorkspace(workspaceId);
        const member = await Member.find({workspaceId}).populate('role');
        const workspaceWithMember = {...workspace!.toObject(), member}
        return {
            workspace: workspaceWithMember
        }
    }

    async getWorkspaceMember(workspaceId: string) {
        const members = await Member.find({workspaceId})
            .populate('userId', 'name email profilePicture')
            .populate('role', 'name')
        const roles = await Role.find({}, {name: 1, _id: 1})
            .select('-permissions')
            .lean()
        return { members, roles }
    }
}   

export default new WorkspaceServices();