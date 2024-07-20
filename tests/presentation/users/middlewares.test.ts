import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { securedUser } from '../../../src/presentation/users/middlewares.user';
import { JwtPlugin } from '../../../src/config/plugins';

jest.mock('../../../src/config/plugins', () => ({
    JwtPlugin: {
        getPayload: jest.fn(),
    },
}));

describe('securedUser Middleware', () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();

        app.get('/protected', [securedUser], (req: Request, res: Response) => {
            res.status(200).send({
                message: 'Access granted',
                user: res.locals.user,
            });
        });
    });

    test('should allow access with a valid token', async () => {
        const mockUser = { email: 'test.user@example.com', role: 'user' };
        (JwtPlugin.getPayload as jest.Mock).mockResolvedValue(mockUser);

        const token = 'valid_token';
        
        const { body } = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(body).toEqual({
            message: 'Access granted',
            user: mockUser,
        });
    });

    test('should return 401 for missing token', async () => {
        await request(app)
            .get('/protected')
            .expect(401,);
    });

    test('should return 401 for invalid token', async () => {
        (JwtPlugin.getPayload as jest.Mock).mockResolvedValue(null);

        const token = 'invalid_token';

        await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
    });
});
