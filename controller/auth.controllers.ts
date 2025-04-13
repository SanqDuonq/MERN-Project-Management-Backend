import appConfig from "../config/app.config";
import asyncError from "../util/async-error";
import { Express, NextFunction, Request,Response } from "express";
import { registerSchema } from "../validation/auth.validation";
import authServices from "../service/auth.services";
import returnRes from "../util/return-response";
import passport from "passport";

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

    loginUser = asyncError(async(req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error | null, user: Express.User, info: {message: string} | undefined) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                returnRes(res, 401, info?.message || 'Invalid email or password')
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                returnRes(res, 200, 'Logged in successfully', user)
            }) 
        }) (req, res, next)
    }) 

    logout = asyncError(async(req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('Error session', err);
                returnRes(res, 500, 'Failed to logged out')
            }
        })
        returnRes(res, 200, 'Logged out successfully')
    })
}

export default new AuthController();