
import {Router} from 'express';
import { AdminController } from './controller';

export class AdminRoutes {

    static get routes():Router {

        const router = Router();

        const adminController = new AdminController();

        /** 
         * @swagger
         * /api/admin/users:
         *   get:
         *     summary: Get all users
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: getAllUsers
         *     tags: 
         *       - Admin
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
        router.get('/users', adminController.getAllUsers);

        /** 
         * @swagger
         * /api/admin/users:
         *   put:
         *     summary: Update user role or information
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: updateUser
         *     tags: 
         *       - Admin
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
        router.put('/users/:id', adminController.updateUser);

        /** 
         * @swagger
         * /api/admin/users:
         *   delete:
         *     summary: Delete user from platform
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: deleteUser
         *     tags: 
         *       - Admin
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
        router.delete('/users/:id', adminController.deleteUser);

        return router;
    }

}
