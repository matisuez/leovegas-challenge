import { AdminDatasource } from "../../../src/core/datasources/admin.datasource";
import { AdminRepositoryImpl } from "../../../src/infrastructure/repositories/admin.repository.impl";
import { AdminUpdateUserDto } from "../../../src/core/dtos";
import { UserEntity, UserRole } from "../../../src/core/entities";

const mockAdminDatasource = {
    getAllUsers: jest.fn(),
    getUserRole: jest.fn(),
    updateUser: jest.fn(),
    delete: jest.fn(),
} as unknown as AdminDatasource;

describe('AdminRepositoryImpl', () => {
    const adminRepository = new AdminRepositoryImpl(mockAdminDatasource);

    const userEntity = new UserEntity({
        id: 1,
        email: 'user@example.com',
        password: 'hashedpassword',
        role: UserRole.USER,
        name: 'Test User',
        accessToken: 'testtoken',
        available: true,
    });

    const adminUpdateUserDto: AdminUpdateUserDto = {
        userEmail: 'user@example.com',
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123',
        role: UserRole.ADMIN,
        accessToken: 'newaccesstoken',
    };

    describe('getAllUsers', () => {
        it('Should call adminDatasource.getAllUsers and return an array of UserEntity', async () => {
            (mockAdminDatasource.getAllUsers as jest.Mock).mockResolvedValue([userEntity]);

            const result = await adminRepository.getAllUsers();

            expect(mockAdminDatasource.getAllUsers).toHaveBeenCalled();
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            expect(result[0]).toBeInstanceOf(UserEntity);
        });
    });

    describe('getUserRole', () => {
        it('Should call adminDatasource.getUserRole and return a UserRole', async () => {
            (mockAdminDatasource.getUserRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);

            const result = await adminRepository.getUserRole('user@example.com');

            expect(mockAdminDatasource.getUserRole).toHaveBeenCalledWith('user@example.com');
            expect(result).toBe(UserRole.ADMIN);
        });
    });

    describe('updateUser', () => {
        it('Should call adminDatasource.updateUser and return a UserEntity', async () => {
            (mockAdminDatasource.updateUser as jest.Mock).mockResolvedValue(userEntity);

            const result = await adminRepository.updateUser(adminUpdateUserDto);

            expect(mockAdminDatasource.updateUser).toHaveBeenCalledWith(adminUpdateUserDto);
            expect(result).toBeInstanceOf(UserEntity);
        });
    });

    describe('delete', () => {
        it('Should call adminDatasource.delete and return a UserEntity', async () => {
            (mockAdminDatasource.delete as jest.Mock).mockResolvedValue(userEntity);

            const result = await adminRepository.delete('user@example.com');

            expect(mockAdminDatasource.delete).toHaveBeenCalledWith('user@example.com');
            expect(result).toBeInstanceOf(UserEntity);
        });
    });
});
