
import { AdminRepository } from "../../../src/core/repositories/admin.repository";
import { UserEntity, UserRole } from "../../../src/core/entities";
import { AdminUpdateUserDto } from "../../../src/core/dtos/";

describe('admin.repository.ts AdminRepository', () => {
    const mockUsers: UserEntity[] = [
        new UserEntity({
            id: 1,
            email: 'admin1@example.com',
            password: 'hashedpassword1',
            role: UserRole.ADMIN,
            name: 'Admin One',
            accessToken: 'token123'
        }),
        new UserEntity({
            id: 2,
            email: 'admin2@example.com',
            password: 'hashedpassword2',
            role: UserRole.ADMIN,
            name: 'Admin Two',
            accessToken: 'token456'
        })
    ];

    const mockUser = new UserEntity({
        id: 1,
        email: 'admin1@example.com',
        password: 'hashedpassword1',
        role: UserRole.ADMIN,
        name: 'Admin One',
        accessToken: 'token123'
    });

    const updateUserDto: AdminUpdateUserDto = {
        userEmail: 'admin1@example.com',
        name: 'Admin Updated',
        email: 'admin1@example.com',
        password: 'newpassword123',
        role: UserRole.USER,
        accessToken: 'newaccesstoken'
    };

    class MockAdminRepository implements AdminRepository {
        getAllUsers = jest.fn(async (): Promise<UserEntity[]> => {
            return mockUsers;
        });
        getUserRole = jest.fn(async (email: string): Promise<UserRole> => {
            return mockUsers.find(user => user.email === email)?.role || UserRole.USER;
        });
        updateUser = jest.fn(async (updateUserDto: AdminUpdateUserDto): Promise<UserEntity> => {
            return {
                ...mockUser,
                ...updateUserDto
            };
        });
        delete = jest.fn(async (email: string): Promise<UserEntity> => {
            return mockUsers.find(user => user.email === email) as UserEntity;
        });
    }

    test('Should test the abstract class methods', async () => {
        const mockAdminRepository = new MockAdminRepository();

        expect(mockAdminRepository).toBeInstanceOf(MockAdminRepository);
        expect(mockAdminRepository).toHaveProperty('getAllUsers');
        expect(mockAdminRepository).toHaveProperty('getUserRole');
        expect(mockAdminRepository).toHaveProperty('updateUser');
        expect(mockAdminRepository).toHaveProperty('delete');

        const allUsers = await mockAdminRepository.getAllUsers();
        expect(allUsers).toStrictEqual(mockUsers);
        expect(mockAdminRepository.getAllUsers).toHaveBeenCalled();

        const userRole = await mockAdminRepository.getUserRole(mockUser.email);
        expect(userRole).toBe(UserRole.ADMIN);
        expect(mockAdminRepository.getUserRole).toHaveBeenCalledWith(mockUser.email);

        const updatedUser = await mockAdminRepository.updateUser(updateUserDto);
        expect(updatedUser.name).toBe(updateUserDto.name);
        expect(updatedUser.password).toBe(updateUserDto.password);
        expect(updatedUser.accessToken).toBe(updateUserDto.accessToken);
        expect(updatedUser.role).toBe(updateUserDto.role);
        expect(mockAdminRepository.updateUser).toHaveBeenCalledWith(updateUserDto);

        const deletedUser = await mockAdminRepository.delete(mockUser.email);
        expect(deletedUser).toStrictEqual(mockUser);
        expect(mockAdminRepository.delete).toHaveBeenCalledWith(mockUser.email);
    });
});

