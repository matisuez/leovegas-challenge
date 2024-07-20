

import {prisma} from '../../data/postgres';

import { AdminUpdateUserDto } from '../../core/dtos';
import { UserEntity, UserRole } from '../../core/entities';
import { BadRequestError } from '../../core/errors/custom.error';
import { AdminDatasource } from '../../core/datasources/admin.datasource';


export class AdminDatasourceImpl implements AdminDatasource {
    async getAllUsers(): Promise<UserEntity[]> {
        const users = await prisma.user.findMany({
            where: {
                available: true,
            }
        });
        return users.map( UserEntity.fromObject );
    }

    async getUserRole(email:string): Promise<UserRole> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                available: true,
            },
        });

        if ( !user ) {
            throw new BadRequestError('User not found');
        }

        return UserRole[user.role];
    }

    async updateUser(adminUpdateUserDto: AdminUpdateUserDto): Promise<UserEntity> {

        const user = await prisma.user.findUnique({
            where: {
                email: adminUpdateUserDto.email,
                available: true,
            }
        });

        if ( user ) {
            throw new BadRequestError('User already exists');
        }

        const {
            userEmail,
            ...userInfo
        } = adminUpdateUserDto;

        const udaptedUser = await prisma.user.update({
            where: {
                email: userEmail,
                available: true,
            },
            data: {
                ...userInfo,
            }
        });

        return UserEntity.fromObject( udaptedUser );
    }

    async delete(email: string): Promise<UserEntity> {
        const user = await prisma.user.update({
            where: {
                email: email,
                available: true,
            },
            data: {
                available: false,
            }
        });

        if ( !user ) {
            throw new BadRequestError('User not found');
        }

        return UserEntity.fromObject( user );
    }

}

