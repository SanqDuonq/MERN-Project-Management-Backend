import { Request, Response, NextFunction } from "express"

const asyncError = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req,res,next)).catch(next);
    }
}

export default asyncError;