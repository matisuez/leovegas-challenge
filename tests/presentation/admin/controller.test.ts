import { Request, Response, NextFunction } from 'express';
import { AdminController } from '../../../src/presentation/admin/controller';
import { AdminRepository } from '../../../src/core/repositories/admin.repository';
import { BcryptPlugin, JwtPlugin } from '../../../src/config/plugins';
import { BadRequestError, CustomError, InternalServerError } from '../../../src/core/errors/custom.error';
import { UserRole } from '../../../src/core/entities';

jest.mock('../../../src/config/plugins', () => ({
    BcryptPlugin: {
        hashPassword: jest.fn(),
    },
    JwtPlugin: {
        createToken: jest.fn(),
    },
}));

class MockAdminRepository extends AdminRepository {
    getAllUsers = jest.fn();
    updateUser = jest.fn();
    delete = jest.fn();
    getUserRole = jest.fn();
}

describe('AdminController', () => {
    let adminController: AdminController;
    let adminRepository: MockAdminRepository;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        adminRepository = new MockAdminRepository();
        adminController = new AdminController(adminRepository);

        req = {};
        res = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('getAllUsers', () => {
        it('should return all users with status 200', async () => {
            const mockUsers = [
                { id: 1, name: 'User One', email: 'user1@example.com', role: UserRole.USER },
                { id: 2, name: 'User Two', email: 'user2@example.com', role: UserRole.USER }
            ];

            (adminRepository.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            await adminController.getAllUsers(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: `All users, total ${mockUsers.length}`,
                users: mockUsers,
            });
        });

        it('should call next with CustomError if one is thrown', async () => {
            const customError = new CustomError('Custom error');

            (adminRepository.getAllUsers as jest.Mock).mockRejectedValue(customError);

            await adminController.getAllUsers(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(customError);
        });

        it('should call next with InternalServerError if an unknown error is thrown', async () => {
            const unknownError = new Error('Unknown error');

            (adminRepository.getAllUsers as jest.Mock).mockRejectedValue(unknownError);

            await adminController.getAllUsers(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });
    });

    describe('updateUser', () => {
        beforeEach(() => {
            res.locals!.user = { email: 'admin@example.com', role: UserRole.ADMIN };
        });

        it('should update user info with status 200', async () => {
            const mockUpdatedUser = {
                id: 1,
                name: 'Updated User',
                email: 'updated.user@example.com',
                role: UserRole.USER,
                accessToken: 'new_token',
            };

            (adminRepository.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);
            (adminRepository.getUserRole as jest.Mock).mockResolvedValue(UserRole.USER);
            (BcryptPlugin.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
            (JwtPlugin.createToken as jest.Mock).mockReturnValue('new_token');

            req.params = { email: 'user@example.com' };
            req.body = {
                name: 'Updated User',
                email: 'updated.user@example.com',
                password: 'newpassword',
                repeatedPassword: 'newpassword',
            };

            await adminController.updateUser(req as Request, res as Response, next);

            expect(adminRepository.updateUser).toHaveBeenCalledWith({
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

        it('should call next with BadRequestError if admin tries to update themselves', async () => {
            req.params = { email: 'admin@example.com' };
            res.locals!.user = { email: 'admin@example.com', role: UserRole.ADMIN };

            await adminController.updateUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(CustomError));
        });

        it('should call next with CustomError if one is thrown', async () => {
            const customError = new CustomError('Custom error');

            (adminRepository.updateUser as jest.Mock).mockRejectedValue(customError);

            req.params = { email: 'user@example.com' };
            req.body = { name: 'Updated User' };

            await adminController.updateUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(customError);
        });

        it('should call next with InternalServerError if an unknown error is thrown', async () => {
            const unknownError = new Error('Unknown error');

            (adminRepository.updateUser as jest.Mock).mockRejectedValue(unknownError);

            req.params = { email: 'user@example.com' };
            req.body = { name: 'Updated User' };

            await adminController.updateUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });
    });

    describe('deleteUser', () => {
        beforeEach(() => {
            res.locals!.user = { email: 'admin@example.com', role: UserRole.ADMIN };
        });

        it('should delete user with status 200', async () => {
            const mockDeletedUser = { role: UserRole.USER };

            (adminRepository.delete as jest.Mock).mockResolvedValue(mockDeletedUser);

            req.params = { email: 'user@example.com' };

            await adminController.deleteUser(req as Request, res as Response, next);

            expect(adminRepository.delete).toHaveBeenCalledWith('user@example.com');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User deleted',
                email: 'user@example.com',
                role: UserRole.USER,
            });
        });

        it('should call next with BadRequestError if admin tries to delete themselves', async () => {
            req.params = { email: 'admin@example.com' };

            await adminController.deleteUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
        });

        it('should call next with CustomError if one is thrown', async () => {
            const customError = new CustomError('Custom error');

            (adminRepository.delete as jest.Mock).mockRejectedValue(customError);

            req.params = { email: 'user@example.com' };

            await adminController.deleteUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(customError);
        });

        it('should call next with InternalServerError if an unknown error is thrown', async () => {
            const unknownError = new Error('Unknown error');

            (adminRepository.delete as jest.Mock).mockRejectedValue(unknownError);

            req.params = { email: 'user@example.com' };

            await adminController.deleteUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(expect.any(InternalServerError));
        });
    });
});
