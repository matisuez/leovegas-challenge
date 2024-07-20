import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { AdminRoutes } from '../../../src/presentation/admin/routes';
import { AdminController } from '../../../src/presentation/admin/controller';
import { JwtPlugin } from '../../../src/config/plugins';
import { UserRole } from '../../../src/core/entities';

jest.mock('../../../src/presentation/admin/controller', () => ({
    AdminController: jest.fn().mockImplementation(() => ({
        getAllUsers: jest.fn((req: Request, res: Response) => res.status(200).json({ message: 'All users' })),
        updateUser: jest.fn((req: Request, res: Response) => res.status(200).json({ message: 'User updated' })),
        deleteUser: jest.fn((req: Request, res: Response) => res.status(200).json({ message: 'User deleted' })),
    })),
}));

jest.mock('../../../src/config/plugins', () => ({
    JwtPlugin: {
        getPayload: jest.fn(),
    },
}));

jest.mock('../../../src/presentation/admin/middlewares.admin', () => ({
    securedAdmin: jest.fn((req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        JwtPlugin.getPayload(token)
            .then((payload) => {
                if (payload.role !== UserRole.ADMIN) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                res.locals.user = payload;
                next();
            })
            .catch(() => res.status(401).json({ message: 'Unauthorized' }));
    }),
}));

describe('AdminRoutes', () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api/admin', AdminRoutes.routes);
    });

    describe('GET /api/admin/users', () => {
        test('should return 200 and all users', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'admin@example.com', role: UserRole.ADMIN });

            const { body } = await request(app)
                .get('/api/admin/users')
                .set('Authorization', 'Bearer valid_token')
                .expect(200);

            expect(body).toEqual({ message: 'All users' });
        });

        test('should return 401 for missing token', async () => {
            await request(app)
                .get('/api/admin/users')
                .expect(401);
        });
    });

    describe('PUT /api/admin/users/:email', () => {
        test('should update user and return 200', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'admin@example.com', role: UserRole.ADMIN });

            const updateData = { name: 'Updated User' };

            const { body } = await request(app)
                .patch('/api/admin/users/test.user@example.com')
                .set('Authorization', 'Bearer valid_token')
                .send(updateData)
                .expect(200);

            expect(body).toEqual({ message: 'User updated' });
        });

        test('should return 400 for invalid email format', async () => {
            await request(app)
                .patch('/api/admin/users/invalidemail')
                .set('Authorization', 'Bearer valid_token')
                .send({ name: 'Updated User' })
                .expect(400);
        });

        test('should return 401 for missing token', async () => {
            await request(app)
                .patch('/api/admin/users/test.user@example.com')
                .send({ name: 'Updated User' })
                .expect(401);
        });

        test('should return 400 when no fields are provided', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'admin@example.com', role: UserRole.ADMIN });
        
            const updateData = {};
        
            await request(app)
                .patch('/api/admin/users/test.user@example.com')
                .set('Authorization', 'Bearer valid_token')
                .send(updateData)
                .expect(400);
        
        });

        test('should return 400 when passwords do not match', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'admin@example.com', role: UserRole.ADMIN });
        
            const updateData = { password: 'newpassword', repeatedPassword: 'differentpassword' };
        
            await request(app)
                .patch('/api/admin/users/test.user@example.com')
                .set('Authorization', 'Bearer valid_token')
                .send(updateData)
                .expect(400);
        
        });

    });

    describe('DELETE /api/admin/users/:email', () => {
        test('should delete user and return 200', async () => {
            (JwtPlugin.getPayload as jest.Mock).mockResolvedValue({ email: 'admin@example.com', role: UserRole.ADMIN });

            const { body } = await request(app)
                .delete('/api/admin/users/test.user@example.com')
                .set('Authorization', 'Bearer valid_token')
                .expect(200);

            expect(body).toEqual({ message: 'User deleted' });
        });

        test('should return 400 for invalid email format', async () => {
            await request(app)
                .delete('/api/admin/users/invalidemail')
                .set('Authorization', 'Bearer valid_token')
                .expect(400);
        });

        test('should return 401 for missing token', async () => {
            await request(app)
                .delete('/api/admin/users/test.user@example.com')
                .expect(401);
        });
    });
});
