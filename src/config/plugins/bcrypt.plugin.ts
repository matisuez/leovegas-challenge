import {hash, compare} from 'bcryptjs';

export class BcryptPlugin {
    private static saltRounds: number = 10;

    public static async hashPassword(password: string): Promise<string> {
        return hash(password, this.saltRounds);
    }

    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    }
}