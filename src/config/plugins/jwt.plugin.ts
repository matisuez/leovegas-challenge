import { sign, verify } from 'jsonwebtoken';
import { prisma } from '../../data/postgres';
import { UserRole } from '../../core/entities';
import { UnauthorizedError } from '../../core/errors/custom.error';

export interface TokenPayload {
    email: string;
    role: UserRole;
}

export class JwtPlugin {
    private static expiration: string = '1h';
    private static secret: string = process.env.JWT_SECRET || 'yourSecretKey';

    public static createToken(options: TokenPayload): string {
        const payload = { ...options };
        return sign(payload, this.secret, { expiresIn: this.expiration });
    }

    public static refreshToken(token: string): string {
        try {
            const decoded: any = verify(token, this.secret);
            const { exp, iat, ...tokenOptions } = decoded;
            return this.createToken(tokenOptions);
        } catch (error) {
            throw new UnauthorizedError('Invalid token');
        }
    }

    public static async getPayload(token: string): Promise<TokenPayload> {
        try {
            const decoded: any = verify(token, this.secret);
            const user = await prisma.user.findFirst({
                where: {
                    accessToken: token,
                    email: decoded.email,
                    role: decoded.role,
                }
            });

            if (!user) {
                throw new UnauthorizedError('Invalid token');
            }

            const tokenOptions: TokenPayload = {
                email: decoded.email,
                role: decoded.role,
            };

            return tokenOptions;

        } catch (error) {
            throw new UnauthorizedError('Invalid token');
        }
    }
}
