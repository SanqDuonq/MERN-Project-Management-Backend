import User from "../model/user.model";
import throwError from "../util/throw-error";
import { RoleEnum } from '../enum/role.enum';
import Role from "../model/role-permission.model";
import Workspace from "../model/workspace.model";
import Member from "../model/member.model";
import mongoose from "mongoose";
import Task from "../model/task.model";
import { TaskStatusEnum } from "../enum/task.enum";
import { IRole } from "../interface/role.interface";
import Project from "../model/project.model";

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

    private async checkRoleId(roleId: string) {
        const role = await Role.findById(roleId);
        if (!role) {
            throwError(404, 'Role not found')
        }
        return role as IRole;
    }

    private async checkMember(memberId: string, workspaceId: string) {
        const member = await Member.findOne({userId: memberId, workspaceId: workspaceId});
        if(!member) {
            throwError(404, 'Member not found in the workspace')
        }
        return member;
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

    async getWorkspaceAnalytics(workspaceId: string) {
        const current = new Date();
        const totalTasks = await Task.countDocuments({
            workspace: workspaceId
        })
        const overdueTasks = await Task.countDocuments({
            workspace: workspaceId,
            dueDate: { $lt: current},
            status: { $ne: TaskStatusEnum.DONE}
        })
        const completedTasks = await Task.countDocuments({
            workspace: workspaceId,
            status: TaskStatusEnum.DONE
        })
        const analytics = {
            totalTasks,
            overdueTasks, 
            completedTasks
        }
        return { analytics };
    }

    async changeMemberRole(workspaceId: string, roleId: string, memberId: string) {
        await this.checkWorkspace(workspaceId);
        const role = await this.checkRoleId(roleId);
        const member = await this.checkMember(memberId, workspaceId);
        member!.role = role;
        await member!.save(); 
        return { member };
    }

    async updateWorkspace(workspaceId: string, name: string, description?: string) {
        const workspace = await this.checkWorkspace(workspaceId);
        workspace!.name = name || workspace!.name
        workspace!.description = String(description) || String(workspace?.description)
        await workspace!.save();
        return { workspace }
    }

    async deleteWorkspace(workspaceId: string, userId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const workspace = await Workspace.findById(workspaceId).session(session);
            if (!workspace) {
                throwError(404, 'Workspace not found');
            }
            if (workspace!.owner.toString() !== userId) {
                throwError(401, 'You are not authorized to delete this workspace');
            }
            const user = await User.findById(userId).session(session);
            if (!user) {
                throwError(404, 'User not found')
            }
            await Project.deleteMany({workspace: workspace!._id}).session(session);
            await Task.deleteMany({workspace: workspace!._id}).session(session);
            await Member.deleteMany({workspaceId: workspace!._id}).session(session);
            if (user?.currentWorkspace?.equals(workspaceId)) {
                const memberWorkspace = await Member.findOne({userId}).session(session);
                user!.currentWorkspace = memberWorkspace ? memberWorkspace.workspaceId : null;
                await user.save();
            }   
            await workspace!.deleteOne({session});
            await session.commitTransaction();
            session.endSession();
            return {
                currentWorkspace: user!.currentWorkspace
            }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}   

export default new WorkspaceServices();