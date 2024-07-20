import { UserEntity, UserRole } from '../../../src/core/entities/user.entity';

describe('UserEntity', () => {
    const userOptions = {
        id: 1,
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'password123',
        role: UserRole.USER,
        accessToken: 'some_token',
        available: true,
    };

    describe('constructor', () => {
        test('Should create a UserEntity with provided options', () => {
            const user = new UserEntity(userOptions);

            expect(user.id).toBe(userOptions.id);
            expect(user.name).toBe(userOptions.name);
            expect(user.email).toBe(userOptions.email);
            expect(user.password).toBe(userOptions.password);
            expect(user.role).toBe(userOptions.role);
            expect(user.accessToken).toBe(userOptions.accessToken);
            expect(user.available).toBe(userOptions.available);
        });

        test('Should create a UserEntity with default values', () => {
            const user = new UserEntity({ id: 2, role: UserRole.USER });

            expect(user.id).toBe(2);
            expect(user.name).toBe('');
            expect(user.email).toBe('');
            expect(user.password).toBe('');
            expect(user.role).toBe(UserRole.USER);
            expect(user.accessToken).toBe('');
            expect(user.available).toBe(true);
        });
    });

    describe('fromObject', () => {
        test('Should create a UserEntity from a plain object', () => {
            const userObject = {
                id: 3,
                name: 'Another User',
                email: 'another.user@example.com',
                password: 'password456',
                role: UserRole.ADMIN,
                accessToken: 'another_token',
                available: false,
            };

            const user = UserEntity.fromObject(userObject);

            expect(user.id).toBe(userObject.id);
            expect(user.name).toBe(userObject.name);
            expect(user.email).toBe(userObject.email);
            expect(user.password).toBe(userObject.password);
            expect(user.role).toBe(userObject.role);
            expect(user.accessToken).toBe(userObject.accessToken);
            expect(user.available).toBe(userObject.available);
        });

        test('Should handle missing optional properties in fromObject', () => {
            const userObject = {
                id: 4,
                role: UserRole.USER,
            };

            const user = UserEntity.fromObject(userObject);

            expect(user.id).toBe(userObject.id);
            expect(user.name).toBe('');
            expect(user.email).toBe('');
            expect(user.password).toBe('');
            expect(user.role).toBe(UserRole.USER);
            expect(user.accessToken).toBe('');
            expect(user.available).toBe(true);
        });
    });
});
