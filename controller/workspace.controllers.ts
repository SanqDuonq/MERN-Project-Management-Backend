import asyncError from "../util/async-error";
import { Request, Response } from "express";
import { createWorkspaceSchema } from "../validation/workspace.validation";
import workspaceServices from "../service/workspace.services";
import returnRes from "../util/return-response";

class WorkspaceController {
    create = asyncError(async(req: Request, res: Response) => {
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

    
}

export default new WorkspaceController();