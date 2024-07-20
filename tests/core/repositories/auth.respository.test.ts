import { UserEntity, UserRole } from "../../../src/core/entities";
import { LoginUserDto, RegisterUserDto } from "../../../src/core/dtos";
import { AuthRepository } from "../../../src/core/repositories/auth.repository";


describe('auth.repository.ts AuthRepository', () => {

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

    class MockAuthRepository implements AuthRepository {
        async checkEmailExistence(email: string): Promise<boolean> {
            return email === mockUser.email;
        }
        async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
            return mockUser;
        }
        async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
            return mockUser;
        }
        async updateAccessToken(accessToken: string, email: string): Promise<void> {
            return;
        }
    }

    test('Should test the abstract class', async () => {
        const mockAuthRepository = new MockAuthRepository();

        expect(mockAuthRepository).toBeInstanceOf(MockAuthRepository);
        expect(mockAuthRepository).toHaveProperty('checkEmailExistence');
        expect(mockAuthRepository).toHaveProperty('login');
        expect(mockAuthRepository).toHaveProperty('register');

        expect(typeof mockAuthRepository.checkEmailExistence).toBe('function');
        expect(typeof mockAuthRepository.login).toBe('function');
        expect(typeof mockAuthRepository.register).toBe('function');

        const emailExists = await mockAuthRepository.checkEmailExistence(mockUser.email);
        expect(emailExists).toBe(true);

        const loggedInUser = await mockAuthRepository.login(loginUserDto);
        expect(loggedInUser).toBeInstanceOf(UserEntity);
        expect(loggedInUser.email).toBe(mockUser.email);

        const registeredUser = await mockAuthRepository.register(registerUserDto);
        expect(registeredUser).toBeInstanceOf(UserEntity);
        expect(registeredUser.email).toBe(mockUser.email);
    });
});
