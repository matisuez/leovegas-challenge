

import {
    Request,
    Response,
    NextFunction,
} from 'express';

import { JwtPlugin } from '../../config/plugins';
import { UnauthorizedError } from '../../core/errors/custom.error';

export const securedUser = async(req: Request, res: Response, next:NextFunction) => {
    try {

        let token: string | undefined = req.headers.authorization;

        if ( typeof token === 'undefined' ) {
            throw new UnauthorizedError(`Token not defined`);
        }

        token = token.replace('Bearer ', '');

        const user = await JwtPlugin.getPayload(token);

        if ( !user ) {
            throw new UnauthorizedError(`Invalid token`);
        }

        res.locals.user = user;

        next();

    } catch (error) {
        next(new UnauthorizedError(`Invalid token`));
    }
}

