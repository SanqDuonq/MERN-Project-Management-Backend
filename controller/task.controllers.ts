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
import { parse } from "dotenv";

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

    getAllTask = asyncError(async(req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const filter = {
            projectId: req.query.projectId as string | undefined,
            status: req.query.status 
                ? (req.query.status as string)?.split(',')
                : undefined,
            priority: req.query.priority 
                ? (req.query.priority as string)?.split(',')
                : undefined,
            assignedTo: req.query.assignedTo 
                ? (req.query.assignedTo as string)?.split(',')
                : undefined,
            keyword: req.query.keyword as string | undefined,
            dueDate: req.query.dueDate as string | undefined
        }
        const pagination = {
            pageSize: parseInt(req.query.pageSize as string) || 10,
            pageNumber: parseInt(req.query.pageNumber as string) || 1 
        }
        const {role} = await memberServices.getMemberRole(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY])
        const result = await taskServices.getAllTask(workspaceId, filter, pagination);
        returnRes(res, 200, 'Get all task successful', result);
    })
}

export default new TaskController();