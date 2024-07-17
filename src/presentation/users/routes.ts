
import {Router} from 'express';

import { UsersController } from './controller';

export class UsersRoutes {

    static get routes():Router {

        const router = Router();

        const usersController = new UsersController();

        /**
         * @swagger
         * /api/users/me:
         *   get:
         *     summary: Get my personal info
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: getMyInfo
         *     tags: 
         *       - Users
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
        router.get('/me', usersController.getMyInfo);


        /** 
         * @swagger
         * /api/users/me:
         *   put:
         *     summary: Update my info
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: updateMyInfo
         *     tags: 
         *       - Users
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
        router.put('/me', usersController.updateMyInfo);

        return router;
    }

}
