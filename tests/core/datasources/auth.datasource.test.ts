import { UserEntity, UserRole } from "../../../src/core/entities";
import { LoginUserDto, RegisterUserDto } from "../../../src/core/dtos";
import { AuthDatasource } from "../../../src/core/datasources/auth.datasource";

describe('auth.datasource.ts AuthDatasource', () => {
    const mockUser = new UserEntity({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        role: UserRole.USER as UserRole,
    });

    const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
    };

    const registerUserDto: RegisterUserDto = {
        name: 'John Doe',
        email: 'newuser@example.com',
        password: 'newpassword123',
        accessToken: 'newtoken123',
    };

    class MockAuthDatasource implements AuthDatasource {
        checkEmailExistence = jest.fn(async (email: string): Promise<boolean> => {
            return email === mockUser.email;
        });
        login = jest.fn(async (loginUserDto: LoginUserDto): Promise<UserEntity> => {
            return mockUser;
        });
        register = jest.fn(async (registerUserDto: RegisterUserDto): Promise<UserEntity> => {
            return mockUser;
        });
        updateAccessToken = jest.fn(async (accessToken: string, email: string): Promise<void> => {
            return;
        });
    }

    test('Should test the abstract class', async () => {
        const mockAuthDatasource = new MockAuthDatasource();

        expect(mockAuthDatasource).toBeInstanceOf(MockAuthDatasource);
        expect(mockAuthDatasource).toHaveProperty('checkEmailExistence');
        expect(mockAuthDatasource).toHaveProperty('login');
        expect(mockAuthDatasource).toHaveProperty('register');

        expect(typeof mockAuthDatasource.checkEmailExistence).toBe('function');
        expect(typeof mockAuthDatasource.login).toBe('function');
        expect(typeof mockAuthDatasource.register).toBe('function');

        const emailExists = await mockAuthDatasource.checkEmailExistence(mockUser.email);
        expect(emailExists).toBe(true);

        const loggedInUser = await mockAuthDatasource.login(loginUserDto);
        expect(loggedInUser).toBeInstanceOf(UserEntity);
        expect(loggedInUser.email).toBe(mockUser.email);

        const registeredUser = await mockAuthDatasource.register(registerUserDto);
        expect(registeredUser).toBeInstanceOf(UserEntity);
        expect(registeredUser.email).toBe(mockUser.email);

        await mockAuthDatasource.updateAccessToken('dadsasdas', registerUserDto.email);
        expect(mockAuthDatasource.updateAccessToken).toHaveBeenCalled();
    });
});
