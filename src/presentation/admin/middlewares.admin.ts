

import {
    Request,
    Response,
    NextFunction,
} from 'express';

import { UserRole } from '../../core/entities';
import { JwtPlugin } from '../../config/plugins';
import { UnauthorizedError } from '../../core/errors/custom.error';

export const securedAdmin = async(req: Request, res: Response, next:NextFunction) => {
    try {

        let token: string | undefined = req.headers.authorization;

        if ( typeof token === 'undefined' ) {
            throw new UnauthorizedError(`Token not defined`);
        }

        token = token.replace('Bearer ', '');

        const adminUser = await JwtPlugin.getPayload(token);

        if ( !adminUser || adminUser.role !== UserRole.ADMIN ) {
            throw new UnauthorizedError(`Token not valid`);
        }

        res.locals.user = adminUser;

        next();

    } catch (error) {
        next(new UnauthorizedError(`Invalid token`));
    }
}


