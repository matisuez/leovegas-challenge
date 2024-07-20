import { UsersDatasource } from "../../../src/core/datasources/users.datasource";
import { UserEntity, UserRole } from "../../../src/core/entities";
import { UpdateUserDto } from "../../../src/core/dtos/";

describe('users.datasource.ts UsersDatasource', () => {
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

    class MockUsersDatasource implements UsersDatasource {
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
        const mockUsersDatasource = new MockUsersDatasource();

        expect(mockUsersDatasource).toBeInstanceOf(MockUsersDatasource);
        expect(mockUsersDatasource).toHaveProperty('getMyInfo');
        expect(mockUsersDatasource).toHaveProperty('updateMyInfo');

        const userInfo = await mockUsersDatasource.getMyInfo(mockUser.email);
        expect(userInfo).toStrictEqual(mockUser);
        expect(mockUsersDatasource.getMyInfo).toHaveBeenCalledWith(mockUser.email);

        const updatedUser = await mockUsersDatasource.updateMyInfo(updateUserDto);
        expect(updatedUser.name).toBe(updateUserDto.name);
        expect(updatedUser.password).toBe(updateUserDto.password);
        expect(updatedUser.accessToken).toBe(updateUserDto.accessToken);
        expect(mockUsersDatasource.updateMyInfo).toHaveBeenCalledWith(updateUserDto);
    });
});
