

import {prisma} from '../../data/postgres';

import { UpdateUserDto } from '../../core/dtos';
import { UserEntity } from '../../core/entities';
import { BadRequestError, UnauthorizedError } from '../../core/errors/custom.error';
import { UsersDatasource } from '../../core/datasources/users.datasource';


export class UsersDatasourceImpl implements UsersDatasource {

    async getMyInfo(email: string): Promise<UserEntity> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                available: true,
            }
        });

        if (!user) {
            throw new BadRequestError('User not found');
        }

        return UserEntity.fromObject(user);
    }

    async updateMyInfo(updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await prisma.user.findUnique({
            where: {
                email: updateUserDto.email,
                available: true,
            }
        });

        if ( user ) {
            throw new BadRequestError('User already exists');
        }

        const {
            userEmail,
            ...userInfo
        } = updateUserDto;

        const updatedUser = await prisma.user.update({
            where: {
                email: userEmail,
                available: true,
            },
            data: userInfo,
        });

        return UserEntity.fromObject(updatedUser);
    }

}

