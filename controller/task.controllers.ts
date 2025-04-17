import asyncError from "../util/async-error";
import { Request, Response } from "express";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../validation/task.validation";
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

    updateTask = asyncError(async(req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const taskId = taskIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const data = updateTaskSchema.parse(req.body);
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_TASK]);
        const {task} = await taskServices.updateTask(workspaceId, projectId, taskId, data);
        returnRes(res, 200, 'Updated task successful', task!);
    })
}

export default new TaskController();