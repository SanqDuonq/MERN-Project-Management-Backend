import asyncError from "../util/async-error";
import { Request, Response } from "express";
import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import workspaceServices from "../service/workspace.services";
import returnRes from "../util/return-response";
import memberServices from "../service/member.services";
import { roleGuard } from "../util/role-guard";
import { Permissions } from "../enum/role.enum";

class WorkspaceController {
    createWorkspace = asyncError(async(req: Request, res: Response) => {
        const data = createWorkspaceSchema.parse(req.body);
        const userId = req.user?._id;
        const {workspace} = await workspaceServices.createWorkspace(userId, data);
        returnRes(res, 201, 'Workspace created successful', workspace!);
    })

    getAllWorkspace = asyncError(async(req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspace = await workspaceServices.getAllWorkspace(userId);
        returnRes(res, 200, 'Get all workspace user is member successful', workspace);
    })

    getWorkspaceById = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        await memberServices.getMemberRole(userId, workspaceId);
        const {workspace} = await workspaceServices.getWorkspaceById(workspaceId);
        returnRes(res, 200, 'Get workspace successful', workspace);
    })    

    getWorkspaceMember = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY])
        const {roles,members} =  await workspaceServices.getWorkspaceMember(workspaceId);
        returnRes(res, 200, 'Get workspace member successful', {roles, members});
    })

    getAnalytics = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);
        const {analytics} = await workspaceServices.getWorkspaceAnalytics(workspaceId);
        returnRes(res, 200, 'Get workspace analytics successful', analytics);
    })

    changeMemberRole = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const {roleId, memberId} = changeRoleSchema.parse(req.body);
        const userId = req.user?._id;
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);
        const {member} = await workspaceServices.changeMemberRole(workspaceId, roleId, memberId);
        returnRes(res, 200, 'Change member role successful', member!);
    })

    updateWorkspace = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const {name, description} = updateWorkspaceSchema.parse(req.body);
        const userId = req.user?._id;
        const {role} = await memberServices.getMemberRole(userId,workspaceId);
        roleGuard(role, [Permissions.EDIT_WORKSPACE]);
        const {workspace} = await workspaceServices.updateWorkspace(workspaceId, name, description);
        returnRes(res, 200, 'Updated workspace successful', workspace!);
    })

    deleteWorkspace = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.DELETE_WORKSPACE]);
        const {currentWorkspace} = await workspaceServices.deleteWorkspace(workspaceId, userId);
        returnRes(res, 200, 'Deleted workspace successful', currentWorkspace!);
    })
}

export default new WorkspaceController();