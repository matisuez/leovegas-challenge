import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { securedAdmin } from '../../../src/presentation/admin/middlewares.admin';
import { JwtPlugin } from '../../../src/config/plugins';
import { UserRole } from '../../../src/core/entities';

jest.mock('../../../src/config/plugins', () => ({
    JwtPlugin: {
        getPayload: jest.fn(),
    },
}));

describe('securedAdmin Middleware', () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();

        app.get('/admin', [securedAdmin], (req: Request, res: Response) => {
            res.status(200).send({
                message: 'Access granted',
                user: res.locals.user,
            });
        });
    });

    test('should allow access with a valid admin token', async () => {
        const mockAdminUser = { email: 'admin.user@example.com', role: UserRole.ADMIN };
        (JwtPlugin.getPayload as jest.Mock).mockResolvedValue(mockAdminUser);

        const token = 'valid_admin_token';

        const { body } = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(body).toEqual({
            message: 'Access granted',
            user: mockAdminUser,
        });
    });

    test('should return 401 for missing token', async () => {
        await request(app)
            .get('/admin')
            .expect(401);
    });

    test('should return 401 for invalid token', async () => {
        (JwtPlugin.getPayload as jest.Mock).mockResolvedValue(null);

        const token = 'invalid_token';

        await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
    });

    test('should return 401 for non-admin token', async () => {
        const mockUser = { email: 'test.user@example.com', role: UserRole.USER };
        (JwtPlugin.getPayload as jest.Mock).mockResolvedValue(mockUser);

        const token = 'valid_user_token';

        await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
    });
});
