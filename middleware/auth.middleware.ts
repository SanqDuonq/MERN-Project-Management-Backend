import { Request, Response, NextFunction } from "express"
import throwError from "../util/throw-error"

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) {
        throwError(401, 'Unauthorized. Please log in');
    }
    else {
        next();
    }
}

export default isAuthenticated;

