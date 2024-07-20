import express from 'express';
import request from 'supertest';

import { prisma } from '../../../src/data/postgres';
import { BcryptPlugin } from '../../../src/config/plugins';
import { AuthRoutes } from '../../../src/presentation/auth/routes';

describe('AuthRoutes', () => {

    let app: express.Application;

    const registerUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        repeatedPassword: 'password123',
    };

    const loginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
    };

    beforeAll(async () => {
        app = express();
        app.use(express.json());
        app.use('/api/auth', AuthRoutes.routes);
        await prisma.$connect();
    });
    
    afterAll(async () => {
        await prisma.$disconnect();
    });
    
    beforeEach(async () => {
        await prisma.user.deleteMany();
    });
    
    afterEach(async () => {
        await prisma.user.deleteMany();
    });

    test('POST /api/auth/register should register a new user and return 201', async () => {
        const {body} = await request(app)
            .post('/api/auth/register')
            .send(registerUserDto)
            .expect(201);

        expect(body).toEqual({
            message: 'User registered successfully',
            accessToken: expect.any(String),
        });
    });

    test('POST /api/auth/register should return 400 for invalid input', async () => {
        const invalidUserDto = { ...registerUserDto, email: 'invalidemail' };

        const {badRequest} = await request(app)
            .post('/api/auth/register')
            .send(invalidUserDto)
            .expect(400);

        expect(badRequest).toBeTruthy();
    });

    test('POST /api/auth/register should return 409 for existing email', async () => {
        await prisma.user.create({
            data: {
                email: registerUserDto.email,
                name: registerUserDto.name,
                password: registerUserDto.password,
                available: true,
            },
        });

        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Jane Doe',
                email: registerUserDto.email,
                password: registerUserDto.password,
                repeatedPassword: registerUserDto.password,
            })
            .expect(400);

    });

    test('POST /api/auth should login a user and return 200', async () => {
        await prisma.user.create({
            data: {
                email: registerUserDto.email,
                name: registerUserDto.name,
                password: await BcryptPlugin.hashPassword(registerUserDto.password),
                available: true,
            },
        });

        const {body} = await request(app)
            .post('/api/auth')
            .send(loginUserDto)
            .expect(200);

        expect(body).toEqual({
            message: 'User logged',
            accessToken: expect.any(String),
        });
    });

    test('POST /api/auth should return 400 for invalid login', async () => {
        await request(app)
            .post('/api/auth')
            .send({
                email: 'invalid@example.com',
                password: 'wrongpassword'
            }).expect(401);
    });
});
