import { JwtPlugin, TokenPayload } from '../../../src/config/plugins';
import { UserRole } from '../../../src/core/entities';
import { UnauthorizedError } from '../../../src/core/errors/custom.error';
import { prisma } from '../../../src/data/postgres';
import { sign } from 'jsonwebtoken';

jest.mock('../../../src/data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
        },
    },
}));

describe('JwtPlugin', () => {
    const secret = 'yourSecretKey';
    const mockUser = {
        email: 'test.user@example.com',
        role: UserRole.USER,
        accessToken: 'valid_token',
    };

    beforeAll(() => {
        process.env.JWT_SECRET = secret;
    });

    describe('createToken', () => {
        test('should create a valid token', () => {
            const payload: TokenPayload = { email: mockUser.email, role: mockUser.role };
            const token = JwtPlugin.createToken(payload);
            const decoded = sign(payload, secret, { expiresIn: '1h' });

            expect(token).toBeTruthy();
            expect(token).toEqual(expect.stringMatching(/^[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+$/));
        });
    });

    describe('refreshToken', () => {
        test('should refresh a valid token', () => {
            const payload: TokenPayload = { email: mockUser.email, role: mockUser.role };
            const oldToken = JwtPlugin.createToken(payload); // Use JwtPlugin to create the token
            const newToken = JwtPlugin.refreshToken(oldToken);

            expect(newToken).toBeTruthy();
            expect(newToken).toEqual(expect.stringMatching(/^[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+$/));
        });

        test('should throw UnauthorizedError for invalid token', () => {
            const invalidToken = 'invalid_token';

            expect(() => JwtPlugin.refreshToken(invalidToken)).toThrow(UnauthorizedError);
        });
    });

    describe('getPayload', () => {
        test('should return payload for a valid token', async () => {
            const payload: TokenPayload = { email: mockUser.email, role: mockUser.role };
            const token = JwtPlugin.createToken(payload); // Use JwtPlugin to create the token

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

            const result = await JwtPlugin.getPayload(token);

            expect(result).toEqual(payload);
        });

        test('should throw UnauthorizedError for invalid token', async () => {
            const invalidToken = 'invalid_token';

            await expect(JwtPlugin.getPayload(invalidToken)).rejects.toThrow(UnauthorizedError);
        });

        test('should throw UnauthorizedError if user is not found', async () => {
            const payload: TokenPayload = { email: mockUser.email, role: mockUser.role };
            const token = JwtPlugin.createToken(payload); // Use JwtPlugin to create the token

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(JwtPlugin.getPayload(token)).rejects.toThrow(UnauthorizedError);
        });
    });
});
