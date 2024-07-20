import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { UsersRoutes } from '../../../src/presentation/users/routes';
import { UsersController } from '../../../src/presentation/users/controller';
import { JwtPlugin } from '../../../src/config/plugins';
import { UserRole } from '../../../src/core/entities';

jest.mock('../../../src/presentation/users/controller', () => ({
    UsersController: jest.fn().mockImplementation(() => ({
        getMyInfo: jest.fn((req: Request, res: Response) => res.status(200).json({ message: 'User info' })),
        updateMyInfo: jest.fn((req: Request, res: Response) => res.status(200).json({ message: 'User info updated' })),
    })),
}));

jest.mock('../../../src/config/plugins', () => ({
    JwtPlugin: {
        getPayload: jest.fn(),
    },
}));

jest.mock('../../../src/presentation/users/middlewares.user', () => ({
    securedUser: jest.fn((req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        JwtPlugin.getPayload(token)
            .then((payload) => {
                res.locals.user = payload;
                next();
            })
            .catch(() => res.status(401).json({ message: 'Unauthorized' }));
    }),
}));

describe('UsersRoutes', () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/users', UsersRoutes.routes);
    });

    describe('GET /api/users/me', () => {
        test('should return 200 and user info', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'user@example.com', role: UserRole.USER });

            const { body } = await request(app)
                .get('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .expect(200);

            expect(body).toEqual({ message: 'User info' });
        });

        test('should return 401 for missing token', async () => {
            await request(app)
                .get('/api/users/me')
                .expect(401);
        });
    });

    describe('PATCH /api/users/me', () => {
        test('should update user info and return 200', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'user@example.com', role: UserRole.USER });

            const updateData = { name: 'Updated User' };

            const { body } = await request(app)
                .patch('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .send(updateData)
                .expect(200);

            expect(body).toEqual({ message: 'User info updated' });
        });

        test('should return 400 when no fields are provided', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'user@example.com', role: UserRole.USER });

            const updateData = {};

            await request(app)
                .patch('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .send(updateData)
                .expect(400);
        });

        test('should return 400 when passwords do not match', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'user@example.com', role: UserRole.USER });

            const updateData = { password: 'newpassword', repeatedPassword: 'differentpassword' };

            await request(app)
                .patch('/api/users/me')
                .set('Authorization', 'Bearer valid_token')
                .send(updateData)
                .expect(400);

        });

        test('should return 401 for missing token', async () => {
            await request(app)
                .patch('/api/users/me')
                .send({ name: 'Updated User' })
                .expect(401);
        });
    });
});
