import asyncError from "../util/async-error";
import { Request, Response } from "express";
import returnRes from "../util/return-response";
import userServices from "../service/user.services";

class UserController {
    getUser = asyncError(async(req: Request, res: Response) => {
        const userId = req.user?._id;
        const {user} = await userServices.getUser(userId);
        returnRes(res, 200, 'Get user current successful', user!);
    })
}

export default new UserController();