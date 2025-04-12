import { Request, Response, NextFunction } from "express"
import { HttpError } from "http-errors";
import { z, ZodError } from "zod";

const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues?.map((err) => ({
        field: err.path.join('.'),
        message: err.message
    }))
    res.status(400).json({
        message: 'Validation failed',
        errors: errors
    })
    return;
}
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Error', error);
    if (error instanceof HttpError) {
        res.status(error.status).json({
            message: error.message
        })
        return;
    }
    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }
    res.status(500).json({
        message: 'Internal Server Error'
    })
    return;
}

export default errorHandler;