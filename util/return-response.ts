import { Response } from "express"

const returnRes = (res: Response, status: number, message: string, data?: Object) => {
    return res.status(status).json({
        message: message,
        data: data
    })
}

export default returnRes;