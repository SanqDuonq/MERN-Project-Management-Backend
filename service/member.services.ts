import Member from "../model/member.model";
import Workspace from "../model/workspace.model";
import throwError from "../util/throw-error";

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
}

export default new MemberServices();