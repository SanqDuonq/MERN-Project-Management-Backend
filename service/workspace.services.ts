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
            role: roleOwner?._id,
            joinAt: new Date()
        })
        user!.currentWorkspace = workspace._id as mongoose.Types.ObjectId,
        await user!.save();
        return { workspace };
    }

    async getAllWorkspace(userId: string) {
        const membership = await Member.find({userId})
            .populate('workspaceId')
            .select('-password')
            .exec()
        const workspaces = membership.map((membership) => membership.workspaceId);
        return {workspaces}; 
    }
}   

export default new WorkspaceServices();