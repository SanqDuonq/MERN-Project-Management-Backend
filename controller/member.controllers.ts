import { Request, Response } from "express";
import asyncError from "../util/async-error";
import { z } from "zod";
import memberServices from "../service/member.services";
import returnRes from "../util/return-response";

class MemberController {
    joinWorkspace = asyncError(async(req: Request, res: Response) => {
        const invitedCode = z.string().parse(req.params.invitedCode);
        const userId = req.user?._id;
        const {workspaceId, role} = await memberServices.joinWorkspace(userId, invitedCode);
        returnRes(res, 200, 'Joined workspace successful', {workspaceId, role})
    })
}

export default new MemberController();