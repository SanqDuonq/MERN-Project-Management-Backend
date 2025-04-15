import mongoose from "mongoose";
import Member from "../model/member.model";
import Workspace from "../model/workspace.model";
import throwError from "../util/throw-error";
import Role from "../model/role-permission.model";
import { RoleEnum } from "../enum/role.enum";

class MemberServices {
    private async checkWorkspace(workspaceId: string) {
        if (!await Workspace.findById(workspaceId)) {
            throwError(404, 'Workspace not found')
        }
    }

    private async checkMember(userId: string, workspaceId: string) {
        if (!await Member.findOne({userId, workspaceId})) {
            throwError(401, 'You are not member this workspace');
        }
    }

    private async checkExistMember(userId: string, workspaceId: string) {
        if (await Member.findOne({userId, workspaceId})) {
            throwError(400, 'You are already a member of this workspace');
        }
    }
    private async checkInvitedCode(invitedCode: string) {
        const workspace = await Workspace.findOne({invitedCode}).exec();
        if(!workspace) {
            throwError(404, 'Invited code or workspace not found')
        }
        return workspace;
    }

    private async checkRole(roleName: string) {
        const role = await Role.findOne({name: roleName});
        if (!role) {
            throwError(404, 'Role not found')
        }
        return role;
    }

    async getMemberRole(userId: string, workspaceId: string) {
        await this.checkWorkspace(workspaceId);
        await this.checkMember(userId, workspaceId);
        const member = await Member.findOne({userId, workspaceId}).populate('role');
        console.log(member!.role)
        const roleName = member!.role?.name;
        return {
            role: roleName
        }
    }

    async joinWorkspace(userId: string, invitedCode: string) {
        const workspace = await this.checkInvitedCode(invitedCode);
        await this.checkExistMember(userId, String(workspace!._id))
        const role = await this.checkRole(RoleEnum.MEMBER);
        await  Member.create({
            userId,
            workspaceId: workspace!._id,
            role: role!._id
        })
        return {
            workspaceId: workspace!._id,
            role: role!.name
        }
    }
    
}

export default new MemberServices();