import { UserEntity, UserRole, } from '../../../src/core/entities';
import { LoginUserDto, RegisterUserDto } from "../../../src/core/dtos";
import { AuthDatasource } from "../../../src/core/datasources/auth.datasource";
import { AuthRepositoryImpl } from "../../../src/infrastructure/repositories/auth.repository.impl";

const mockAuthDatasource = {
    register: jest.fn(),
    login: jest.fn(),
    checkEmailExistence: jest.fn(),
} as unknown as AuthDatasource;

describe('AuthRepositoryImpl', () => {
    const authRepository = new AuthRepositoryImpl(mockAuthDatasource);

    const registerUserDto: RegisterUserDto = {
        name: 'John Doe',
        email: 'newuser@example.com',
        password: 'newpassword123',
        accessToken: 'newtoken123',
    };

    const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
    };

    const newUser = new UserEntity({
        id: 1,
        name: 'New User',
        email: 'newuser@example.com',
        password: 'hashedpassword123',
        role: UserRole.USER as UserRole,
        accessToken: '',
    });

    describe('register', () => {
        it('Should call authDatasource.register and return a UserEntity', async () => {
            (mockAuthDatasource.register as jest.Mock).mockResolvedValue(newUser);

            const result = await authRepository.register(registerUserDto);

            expect(mockAuthDatasource.register).toHaveBeenCalledWith(registerUserDto);
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.email).toBe(newUser.email);
        });
    });

    describe('checkEmailExistence', () => {
        it('Should call authDatasource.checkEmailExistence and return true if email exists', async () => {
            (mockAuthDatasource.checkEmailExistence as jest.Mock).mockResolvedValue(true);

            const result = await authRepository.checkEmailExistence('existinguser@example.com');

            expect(mockAuthDatasource.checkEmailExistence).toHaveBeenCalledWith('existinguser@example.com');
            expect(result).toBe(true);
        });

        it('Should call authDatasource.checkEmailExistence and return false if email does not exist', async () => {
            (mockAuthDatasource.checkEmailExistence as jest.Mock).mockResolvedValue(false);

            const result = await authRepository.checkEmailExistence('nonexistentuser@example.com');

            expect(mockAuthDatasource.checkEmailExistence).toHaveBeenCalledWith('nonexistentuser@example.com');
            expect(result).toBe(false);
        });
    });

    describe('login', () => {
        it('Should call authDatasource.login and return a UserEntity', async () => {
            (mockAuthDatasource.login as unknown as jest.Mock).mockResolvedValue(newUser);

            const result = await authRepository.login(loginUserDto);

            expect(mockAuthDatasource.login).toHaveBeenCalledWith(loginUserDto);
            expect(result).toBeInstanceOf(UserEntity);
            expect(result.email).toBe(newUser.email);
        });

        it('Should throw an error if login fails', async () => {
            const loginError = new Error('Invalid credentials');
            (mockAuthDatasource.login as jest.Mock).mockRejectedValue(loginError);

            await expect(authRepository.login(loginUserDto)).rejects.toThrow('Invalid credentials');
        });
    });
});
