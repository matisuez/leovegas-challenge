import { UsersDatasource } from "../../../src/core/datasources/users.datasource";
import { UsersRepositoryImpl } from "../../../src/infrastructure/repositories/users.repository.impl";
import { UpdateUserDto } from "../../../src/core/dtos";
import { UserEntity, UserRole } from "../../../src/core/entities";

const mockUsersDatasource = {
    getMyInfo: jest.fn(),
    updateMyInfo: jest.fn(),
} as unknown as UsersDatasource;

describe('UsersRepositoryImpl', () => {
    const usersRepository = new UsersRepositoryImpl(mockUsersDatasource);

    const userEntity = new UserEntity({
        id: 1,
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'USER' as UserRole,
        name: 'Test User',
        accessToken: 'testtoken',
        available: true,
    });

    const updateUserDto: UpdateUserDto = {
        userEmail: 'user@example.com',
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123',
        accessToken: 'newaccesstoken',
    };

    describe('getMyInfo', () => {
        it('Should call usersDatasource.getMyInfo and return a UserEntity', async () => {
            (mockUsersDatasource.getMyInfo as jest.Mock).mockResolvedValue(userEntity);

            const result = await usersRepository.getMyInfo('user@example.com');

            expect(mockUsersDatasource.getMyInfo).toHaveBeenCalledWith('user@example.com');
            expect(result).toBeInstanceOf(UserEntity);
        });
    });

    describe('updateMyInfo', () => {
        it('Should call usersDatasource.updateMyInfo and return a UserEntity', async () => {
            (mockUsersDatasource.updateMyInfo as jest.Mock).mockResolvedValue(userEntity);

            const result = await usersRepository.updateMyInfo(updateUserDto);

            expect(mockUsersDatasource.updateMyInfo).toHaveBeenCalledWith(updateUserDto);
            expect(result).toBeInstanceOf(UserEntity);
        });
    });
});
