
import {
    Router,
    Request,
    Response,
} from 'express';

import { AuthRoutes } from './auth/routes';
import { UsersRoutes } from './users/routes';
import { AdminRoutes } from './admin/routes';

import { SeedsRoutes } from './seeds/routes';

export class AppRoutes {

    static get routes():Router {
        const router = Router();

        /**
         * @swagger
         * /api/ping:
         *   get:
         *     summary: Ping status
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: pingStatus
         *     tags: 
         *       - Status
         *     responses:
         *       200:
         *         description: Successful response
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Pong
         *                 status:
         *                   type: string
         *                   example: Success
         */
        router.get('/ping', (req:Request, res:Response) => {
            res.status(200).json({
                message: `Pong`,
                status: `Success`,
            });
        });

        router.use('/seeds', SeedsRoutes.routes);

        router.use('/auth', AuthRoutes.routes);

        router.use('/users', UsersRoutes.routes);
        router.use('/admin', AdminRoutes.routes);

        return router;
    }

}
