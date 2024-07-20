import {Router} from 'express';
import { check } from 'express-validator';


import { AuthController } from './controller';
import { AuthDatasourceImpl } from '../../infrastructure/datasources/auth.datasource.impl';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/auth.repository.impl';

import { validateFields } from '../middlewares';
export class AuthRoutes {

    static get routes():Router {

        const router = Router();

        const authDatasource = new AuthDatasourceImpl();
        const authRepositoryImpl = new AuthRepositoryImpl( authDatasource );
        const authController = new AuthController( authRepositoryImpl );

        /**
         * @swagger
         * /api/auth/register:
         *   post:
         *     summary: Register a new user
         *     description: Registers a new user with the provided details.
         *     operationId: register
         *     tags: 
         *       - Auth
         *     requestBody:
         *       description: User registration details
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RegisterBody'
         *     responses:
         *       201:
         *         description: User registered successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/RegisterSuccessResponse'
         *       400:
         *         description: Bad Request
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AuthErrorResponse'
         *       409:
         *         description: Conflict Error
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AuthErrorResponse'
         */
        router.post('/register', [
                check('name', 'is required')
                    .isString()
                    .not()
                    .isEmpty()
                    .isLength({ min: 4, max: 100 }),
                check('email', 'is required')
                    .isEmail()
                    .withMessage('is not valid'),
                check('password', 'is required')
                    .not()
                    .isEmpty()
                    .isLength({ min: 4, max: 100 })
                    .withMessage('Password must be between 4 and 100 characters'),
                check('repeatedPassword', 'is required')
                    .not()
                    .isEmpty()
                    .custom((value, { req }) => value === req.body.password)
                    .withMessage('Passwords do not match'),
                validateFields,
            ],
            authController.register,
        );

        /**
         * @swagger
         * /api/auth:
         *   post:
         *     summary: Login a user
         *     description: Logs in a user with the provided credentials.
         *     operationId: login
         *     tags:
         *       - Auth
         *     requestBody:
         *       description: User login details
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LoginBody'
         *     responses:
         *       200:
         *         description: User logged in successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AuthErrorResponse'
         *       400:
         *         description: Invalid email or password
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AuthErrorResponse'
         */
        router.post('/', [
                check('email', 'Email is required.')
                    .isEmail()
                    .withMessage('Email is not valid.'),
                check('password', 'Password is required.')
                    .not()
                    .isEmpty()
                    .isLength({ min: 4, max: 100 })
                    .withMessage('Password must be between 4 and 100 characters.'),
                validateFields,
            ],
            authController.login,
        );

        return router;
    }

}
