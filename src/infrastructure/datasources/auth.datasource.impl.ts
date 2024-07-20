
import {prisma} from '../../data/postgres';

import { UserEntity, } from '../../core/entities';
import { LoginUserDto, RegisterUserDto } from '../../core/dtos';
import { AuthDatasource } from '../../core/datasources/auth.datasource';

export class AuthDatasourceImpl implements AuthDatasource {

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const newUser = await prisma.user.create({
            data: registerUserDto,
        });
        return UserEntity.fromObject(newUser);
    }

    async checkEmailExistence(email:string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                email,
                available: true,
            }
        });
        return user !== null;
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await prisma.user.findUnique({
            where: {
                email: loginUserDto.email,
                available: true,
            }
        });
        return UserEntity.fromObject({
            ...user,
        });
    }

    async updateAccessToken(accessToken: string, email: string): Promise<void> {
        await prisma.user.update({
            where: {
                email,
                available: true,
            },
            data: {
                accessToken,
            }
        });
    }

}
