
import {
    Request,
    Response,
    NextFunction,
} from 'express';

import {
    validationResult,
} from 'express-validator';

import { CustomError, BadRequestError, InternalServerError } from '../core/errors/custom.error';

export const validateFields = (req: Request, res: Response, next:NextFunction) => {
    try {
        const errors = validationResult( req );

        if( !errors.isEmpty() ) {
            const errorMessage = errors
                .array()
                .map((err:any) => `${err.path} ${err.msg}`)
                .join(', ');
            throw new BadRequestError(`Bad Request: ${errorMessage}`);
        }

        next();

    } catch (error) {
        if( error instanceof CustomError) {
            next(error);
        } else {
            next(new InternalServerError('Internal Server Error'));
        }
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
        });
    } else {
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};
