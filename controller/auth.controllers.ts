import appConfig from "../config/app.config";
import asyncError from "../util/async-error";
import { Request,Response } from "express";
import { registerSchema } from "../validation/auth.validation";
import authServices from "../service/auth.services";
import returnRes from "../util/return-response";

class AuthController {
    googleCallback = asyncError(async(req: Request, res: Response) => {
        const currentWorkspace = req.user!.currentWorkspace;
        if (!currentWorkspace) {
            return res.redirect(`${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`)
        }
        return res.redirect(`${appConfig.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`)
    })

    registerUser = asyncError(async(req: Request, res: Response) => {
        const data = registerSchema.parse({
            ...req.body
        })
        await authServices.registerUser(data);
        returnRes(res, 201, 'Created user successful')
    })
}

export default new AuthController();