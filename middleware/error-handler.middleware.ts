import { Request, Response, NextFunction } from "express"
import { HttpError } from "http-errors";

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Error', error);
    if (error instanceof HttpError) {
        res.status(error.status).json({
            message: error.message
        })
        return;
    }
    res.status(500).json({
        message: 'Internal Server Error'
    })
    return;
}

export default errorHandler;