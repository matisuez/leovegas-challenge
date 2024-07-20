
import bcrypt from 'bcryptjs';
import { BcryptPlugin } from '../../../src/config/plugins';

describe('BcryptPlugin', () => {
    const password = 'testPassword';
    let hashedPassword: string;

    describe('hashPassword', () => {
        it('Should hash the password', async () => {
            hashedPassword = await BcryptPlugin.hashPassword(password);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toEqual(password);
        });

        it('Should generate different hashes for the same password', async () => {
            const hashedPassword2 = await BcryptPlugin.hashPassword(password);
            expect(hashedPassword).not.toEqual(hashedPassword2);
        });
    });

    describe('comparePassword', () => {
        beforeAll(async () => {
            hashedPassword = await BcryptPlugin.hashPassword(password);
        });

        it('Should return true for correct password comparison', async () => {
            const isMatch = await BcryptPlugin.comparePassword(password, hashedPassword);
            expect(isMatch).toBe(true);
        });

        it('Should return false for incorrect password comparison', async () => {
            const isMatch = await BcryptPlugin.comparePassword('wrongPassword', hashedPassword);
            expect(isMatch).toBe(false);
        });
    });
});

