
import {Router} from 'express';
import { body, check, param } from 'express-validator';

import { AdminController } from './controller';

import { validateFields } from '../middlewares';
import { securedAdmin } from './middlewares.admin';
import { BadRequestError } from '../../core/errors/custom.error';
import { AdminRepositoryImpl } from '../../infrastructure/repositories/admin.repository.impl';
import { AdminDatasourceImpl } from '../../infrastructure/datasources/admin.datasource.impl';

export class AdminRoutes {

    static get routes():Router {

        const router = Router();

        const adminDatasourceImpl = new AdminDatasourceImpl();
        const adminRepositoryImpl = new AdminRepositoryImpl( adminDatasourceImpl );
        const adminController = new AdminController( adminRepositoryImpl );

        /** 
         * @swagger
         * /api/admin/users:
         *   get:
         *     summary: Get all users
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: getAllUsers
         *     tags: 
         *       - Admin
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Successful response
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminGetAllUsersSuccessResponse'
         *       400:
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminErrorResponse'
         *       401:
         *         description: Unauthorized - Token is missing or invalid
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminErrorResponse'
         */
        router.get('/users', [
            securedAdmin,
        ], adminController.getAllUsers);

        /** 
         * @swagger
         * /api/admin/users/{email}:
         *   patch:
         *     summary: Update user role or details
         *     description: Updates the role or details of a user based on the provided email.
         *     operationId: updateUser
         *     tags: 
         *       - Admin
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: email
         *         in: path
         *         required: true
         *         description: The email of the user to delete
         *         schema:
         *           type: string
         *     requestBody:
         *       description: User details to update
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AdminUpdateUserBody'
         *     responses:
         *       200:
         *         description: Successful response
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminUpdateUserSuccessResponse'
         *       400:
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminErrorResponse'
         *       401:
         *         description: Unauthorized - Token is missing or invalid
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminErrorResponse'
         */
        router.patch('/users/:email', [
            securedAdmin,
            body().custom((body) => {
                const fields = ['name', 'email', 'role', 'password', 'repeatedPassword'];
                const hasAtLeastOneField = fields.some(field => body[field] && body[field].trim() !== '');
                if (!hasAtLeastOneField) {
                    throw new BadRequestError('At least one field must be provided');
                }
                return true;
            }),
            check('name').optional().isString().withMessage('Name must be a string'),
            check('email').optional().isEmail().withMessage('Email must be valid'),
            check('role').optional().isString().withMessage('Role must be valid'),
            check('password').optional().isString().withMessage('Password must be a string'),
            check('repeatedPassword').optional().isString().withMessage('Repeated Password must be a string'),
            check('repeatedPassword').custom((value, { req }) => {
                if (req.body.password && value !== req.body.password) {
                    throw new BadRequestError('Passwords must match');
                }
                return true;
            }),
            validateFields,
        ], adminController.updateUser);

        /**
         * @swagger
         * /api/admin/users/{email}:
         *   delete:
         *     summary: Delete user from platform
         *     description: Deletes a user from the platform based on the provided email.
         *     operationId: deleteUser
         *     tags: 
         *       - Admin
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: email
         *         in: path
         *         required: true
         *         description: The email of the user to delete
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Successful response
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminDeleteUserSuccessResponse'
         *       400:
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminErrorResponse'
         *       401:
         *         description: Unauthorized - Token is missing or invalid
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminErrorResponse'
         */
        router.delete('/users/:email', [
            securedAdmin,
            param('email').isEmail().withMessage('Invalid email format'),
            validateFields,
        ], adminController.deleteUser);

        return router;
    }

}
