import { AdminDatasource } from "../../../src/core/datasources/admin.datasource";
import { UserEntity, UserRole } from "../../../src/core/entities";
import { AdminUpdateUserDto } from "../../../src/core/dtos";

describe('admin.datasource.ts AdminDatasource', () => {
    const mockUsers: UserEntity[] = [
        new UserEntity({
            id: 1,
            email: 'admin1@example.com',
            password: 'hashedpassword1',
            role: UserRole.ADMIN as UserRole,
            name: 'John Doe',
            accessToken: 'AAAAAAAAA',
        }),
        new UserEntity({
            id: 2,
            email: 'admin2@example.com',
            password: 'hashedpassword2',
            role: UserRole.ADMIN as UserRole,
            name: 'Charlie Chocolate',
            accessToken: 'BBBBBBBB',
        }),
    ];

    const mockUser = new UserEntity({
        id: 1,
        email: 'admin1@example.com',
        password: 'hashedpassword1',
        role: UserRole.ADMIN as UserRole,
        name: 'John Doe',
        accessToken: 'AAAAAAAAA',
    });

    const updateUserDto: AdminUpdateUserDto = {
        userEmail: 'admin1@example.com',
        email: 'admin1@example.com',
        role: UserRole.USER,
    };

    class MockAdminDatasource implements AdminDatasource {
        getAllUsers = jest.fn(async (): Promise<UserEntity[]> => {
            return mockUsers;
        });
        getUserRole = jest.fn(async (email: string): Promise<UserRole> => {
            return mockUsers.find(user => user.email === email)?.role || UserRole.USER;
        });
        updateUser = jest.fn(async (updateUserDto: AdminUpdateUserDto): Promise<UserEntity> => {
            return {
                ...mockUser,
                role: updateUserDto.role as UserRole,
            };
        });
        delete = jest.fn(async (email: string): Promise<UserEntity> => {
            return mockUsers.find(user => user.email === email) as UserEntity;
        });
    }

    test('Should test the abstract class methods', async () => {
        const mockAdminDatasource = new MockAdminDatasource();

        expect(mockAdminDatasource).toBeInstanceOf(MockAdminDatasource);
        expect(mockAdminDatasource).toHaveProperty('getAllUsers');
        expect(mockAdminDatasource).toHaveProperty('getUserRole');
        expect(mockAdminDatasource).toHaveProperty('updateUser');
        expect(mockAdminDatasource).toHaveProperty('delete');

        const allUsers = await mockAdminDatasource.getAllUsers();
        expect(allUsers).toStrictEqual(mockUsers);
        expect(mockAdminDatasource.getAllUsers).toHaveBeenCalled();

        const userRole = await mockAdminDatasource.getUserRole(mockUser.email);
        expect(userRole).toBe(UserRole.ADMIN);
        expect(mockAdminDatasource.getUserRole).toHaveBeenCalledWith(mockUser.email);

        const updatedUser = await mockAdminDatasource.updateUser(updateUserDto);
        expect(updatedUser.role).toBe(UserRole.USER);
        expect(mockAdminDatasource.updateUser).toHaveBeenCalledWith(updateUserDto);

        const deletedUser = await mockAdminDatasource.delete(mockUser.email);
        expect(deletedUser).toStrictEqual(mockUser);
        expect(mockAdminDatasource.delete).toHaveBeenCalledWith(mockUser.email);
    });
});
