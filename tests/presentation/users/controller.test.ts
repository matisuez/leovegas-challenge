import { Request, Response, NextFunction } from 'express';
import { UsersController } from '../../../src/presentation/users/controller';
import { UsersRepository } from '../../../src/core/repositories/users.repository';
import { BcryptPlugin, JwtPlugin } from '../../../src/config/plugins';
import { CustomError, InternalServerError } from '../../../src/core/errors/custom.error';
import { UserRole } from '../../../src/core/entities';

jest.mock('../../../src/config/plugins', () => ({
    BcryptPlugin: {
        hashPassword: jest.fn(),
    },
    JwtPlugin: {
        createToken: jest.fn(),
    },
}));

class MockUsersRepository extends UsersRepository {
    getMyInfo = jest.fn();
    updateMyInfo = jest.fn();
}

describe('UsersController', () => {
    let usersController: UsersController;
    let usersRepository: MockUsersRepository;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        usersRepository = new MockUsersRepository();
        usersController = new UsersController(usersRepository);

        req = {};
        res = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('getMyInfo', () => {
        it('should return user info with status 200', async () => {
            res.locals!.user = { email: 'user@example.com' };

            const mockUser = {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: UserRole.USER,
            };

            (usersRepository.getMyInfo as jest.Mock).mockResolvedValue(mockUser);

            await usersController.getMyInfo(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role,
            });
        });

        it('should call next with CustomError if one is thrown', async () => {
            const customError = new InternalServerError('Custom error');

            (usersRepository.getMyInfo as jest.Mock).mockRejectedValue(customError);

            await usersController.getMyInfo(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });

        it('should call next with InternalServerError if an unknown error is thrown', async () => {
            const unknownError = new Error('Unknown error');

            (usersRepository.getMyInfo as jest.Mock).mockRejectedValue(unknownError);

            await usersController.getMyInfo(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });
    });

    describe('updateMyInfo', () => {
        beforeEach(() => {
            res.locals!.user = { email: 'user@example.com', role: UserRole.USER };
        });

        it('should update user info with status 200', async () => {
            const mockUpdatedUser = {
                id: 1,
                name: 'Updated User',
                email: 'updated.user@example.com',
                role: UserRole.USER,
                accessToken: 'new_token',
            };

            (usersRepository.updateMyInfo as jest.Mock).mockResolvedValue(mockUpdatedUser);
            (BcryptPlugin.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
            (JwtPlugin.createToken as jest.Mock).mockReturnValue('new_token');

            req.body = {
                name: 'Updated User',
                email: 'updated.user@example.com',
                password: 'newpassword',
                repeatedPassword: 'newpassword',
            };

            await usersController.updateMyInfo(req as Request, res as Response, next);

            expect(usersRepository.updateMyInfo).toHaveBeenCalledWith({
                userEmail: 'user@example.com',
                name: 'Updated User',
                email: 'updated.user@example.com',
                password: 'hashedpassword',
                accessToken: 'new_token',
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: mockUpdatedUser.id,
                name: mockUpdatedUser.name,
                email: mockUpdatedUser.email,
                role: mockUpdatedUser.role,
                accessToken: mockUpdatedUser.accessToken,
            });
        });

        it('should call next with CustomError if one is thrown', async () => {
            const customError = new InternalServerError('Custom error');

            (usersRepository.updateMyInfo as jest.Mock).mockRejectedValue(customError);

            await usersController.updateMyInfo(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });

        it('should call next with InternalServerError if an unknown error is thrown', async () => {
            const unknownError = new Error('Unknown error');

            (usersRepository.updateMyInfo as jest.Mock).mockRejectedValue(unknownError);

            await usersController.updateMyInfo(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });
    });
});
