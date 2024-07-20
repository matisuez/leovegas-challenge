
import {Router} from 'express';
import { body, check } from 'express-validator';

import { UsersController } from './controller';
import { UsersRepositoryImpl } from '../../infrastructure/repositories/users.repository.impl';
import { UsersDatasourceImpl } from '../../infrastructure/datasources/users.datasource.impl';

import { validateFields } from '../middlewares';
import { securedUser } from './middlewares.user';

import { BadRequestError } from '../../core/errors/custom.error';

export class UsersRoutes {

    static get routes():Router {

        const router = Router();

        const usersDatasourceImpl = new UsersDatasourceImpl();
        const usersRepositoryImpl = new UsersRepositoryImpl( usersDatasourceImpl );
        const usersController = new UsersController( usersRepositoryImpl );

        /**
         * @swagger
         * /api/users/me:
         *   get:
         *     summary: Get my personal info
         *     description: Returns user personal info
         *     operationId: getMyInfo
         *     tags: 
         *       - Users
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: User personal info
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/GetMyInfoSuccessResponse'
         *       400:
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserErrorResponse'
         *       401:
         *         description: Unauthorized - Token is missing or invalid
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserErrorResponse'
         */
        router.get('/me', [
            securedUser,
        ], usersController.getMyInfo);


        /** 
         * @swagger
         * /api/users/me:
         *   patch:
         *     summary: Update my info
         *     description: Returns a Pong response to check the status of the API.
         *     operationId: updateMyInfo
         *     tags: 
         *       - Users
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       description: User registration details
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UpdateUserInfoBody'
         *     responses:
         *       200:
         *         description: User registered successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserInfoUpdatedSuccessResponse'
         *       400:
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserErrorResponse'
         *       401:
         *         description: Unauthorized - Token is missing or invalid
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UserErrorResponse'
         */
        router.patch('/me', [
            securedUser,
            body().custom(body => {
                if (
                    !body.name &&
                    !body.email &&
                    !body.password &&
                    !body.repeatedPassword) {
                    throw new BadRequestError('At least one field must be provided');
                }
                return true;
            }),
            check('name').optional().isString().withMessage('Name must be a string'),
            check('email').optional().isEmail().withMessage('Email must be valid'),
            check('password').optional().isString().withMessage('Password must be a string'),
            check('repeatedPassword').optional().isString().withMessage('Repeated Password must be a string'),
            check('repeatedPassword').custom((value, { req }) => {
                if (req.body.password && value !== req.body.password) {
                    throw new BadRequestError('Passwords must match');
                }
                return true;
            }),
            validateFields,
        ], usersController.updateMyInfo);

        return router;
    }

}
