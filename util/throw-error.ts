import createHttpError from "http-errors"

const throwError = (status: number, message: string) => {
    throw createHttpError(status, message);
}

export default throwError;