import asyncError from "../util/async-error";
import { Request, Response } from "express";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { createProjectSchema } from "../validation/project.validation";
import memberServices from "../service/member.services";
import { roleGuard } from "../util/role-guard";
import { Permissions } from "../enum/role.enum";
import returnRes from "../util/return-response";
import projectServices from "../service/project.services";

class ProjectController {
    createProject = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const data = createProjectSchema.parse(req.body);
        const userId = req.user?._id;
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.CREATE_PROJECT]);
        const project = await projectServices.createProject(workspaceId, userId, data);
        returnRes(res, 200, 'Create project successful', project!);
    }) 
}

export default new ProjectController();