import {Router} from 'express';

import { AuthController } from './controller';

export class AuthRoutes {

    static get routes():Router {

        const router = Router();

        const authController = new AuthController();

        /** 
         * @swagger
         * /api/auth:
         *   post:
         *     summary: Signing in with an user
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: login
         *     tags: 
         *       - Auth
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
        router.post('/', authController.login);

        /** 
         * @swagger
         * /api/auth/register:
         *   post:
         *     summary: Signing up with an user
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: register
         *     tags: 
         *       - Auth
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
        router.post('/register', authController.register);

        return router;
    }

}
