import asyncError from "../util/async-error";
import { Request, Response } from "express";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { createTaskSchema } from "../validation/task.validation";
import memberServices from "../service/member.services";
import { roleGuard } from "../util/role-guard";
import { Permissions } from "../enum/role.enum";
import taskServices from "../service/task.services";
import returnRes from "../util/return-response";

class TaskController {
    createTask = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;
        const data = createTaskSchema.parse(req.body);
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.CREATE_TASK])
        const {task} = await taskServices.createTask(workspaceId, projectId, userId, data); 
        returnRes(res, 201, 'Created task successful', task);
    })
}

export default new TaskController();