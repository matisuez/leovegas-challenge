import { UsersRepository } from "../../../src/core/repositories/users.repository";
import { UserEntity, UserRole } from "../../../src/core/entities";
import { UpdateUserDto } from "../../../src/core/dtos/";

describe('users.repository.ts UsersRepository', () => {
    const mockUser = new UserEntity({
        id: 1,
        email: 'user@example.com',
        password: 'hashedpassword',
        name: 'John Doe',
        role: UserRole.USER,
    });

    const updateUserDto: UpdateUserDto = {
        userEmail: 'user@example.com',
        name: 'John Updated',
        email: 'user@example.com',
        password: 'newpassword123',
        accessToken: 'newaccesstoken'
    };

    class MockUsersRepository implements UsersRepository {
        getMyInfo = jest.fn(async (email: string): Promise<UserEntity> => {
            return mockUser;
        });
        updateMyInfo = jest.fn(async (updateUserDto: UpdateUserDto): Promise<UserEntity> => {
            return {
                ...mockUser,
                ...updateUserDto
            };
        });
    }

    test('Should test the abstract class methods', async () => {
        const mockUsersRepository = new MockUsersRepository();

        expect(mockUsersRepository).toBeInstanceOf(MockUsersRepository);
        expect(mockUsersRepository).toHaveProperty('getMyInfo');
        expect(mockUsersRepository).toHaveProperty('updateMyInfo');

        const userInfo = await mockUsersRepository.getMyInfo(mockUser.email);
        expect(userInfo).toStrictEqual(mockUser);
        expect(mockUsersRepository.getMyInfo).toHaveBeenCalledWith(mockUser.email);

        const updatedUser = await mockUsersRepository.updateMyInfo(updateUserDto);
        expect(updatedUser.name).toBe(updateUserDto.name);
        expect(updatedUser.password).toBe(updateUserDto.password);
        expect(updatedUser.accessToken).toBe(updateUserDto.accessToken);
        expect(mockUsersRepository.updateMyInfo).toHaveBeenCalledWith(updateUserDto);
    });
});