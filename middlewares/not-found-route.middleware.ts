import { Request, Response, NextFunction } from "express";

const NotFoundRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: 'Not found this route!'
    })
    return;
}

export default NotFoundRoute;