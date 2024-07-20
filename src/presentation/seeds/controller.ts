
import { 
    Request,
    Response,
    NextFunction,
} from 'express';

import { UserRole } from '../../core/entities';

import {
    CustomError,
    InternalServerError,
} from '../../core/errors/custom.error';

import {
    BcryptPlugin,
    JwtPlugin,
} from '../../config/plugins/';

import { SeedsRepository } from '../../core/repositories/seeds.repository';

export class SeedsController {

    constructor(
        private readonly seedsRepository: SeedsRepository,
    ) {}

    public create = async(req:Request, res:Response, next:NextFunction) => {
        try {

            const userEmail1 = 'user1@example.com';
            const userHashedPassword1 = await BcryptPlugin.hashPassword('userPassword1');
            const userAccessToken1 = JwtPlugin.createToken({
                email: userEmail1,
                role: UserRole.USER,
            });

            const userEmail2 = 'user2@example.com';
            const userHashedPassword2 = await BcryptPlugin.hashPassword('userPassword2');
            const userAccessToken2 = JwtPlugin.createToken({
                email: userEmail1,
                role: UserRole.USER,
            });
            
            const userEmail3 = 'user3@example.com';
            const userHashedPassword3 = await BcryptPlugin.hashPassword('userPassword3');
            const userAccessToken3 = JwtPlugin.createToken({
                email: userEmail3,
                role: UserRole.USER,
            });

            const adminEmail1 = 'admin1@example.com';
            const adminHashedPassword1 = await BcryptPlugin.hashPassword('adminPassword1');
            const adminAccessToken1 = JwtPlugin.createToken({
                email: adminEmail1,
                role: UserRole.ADMIN,
            });

            const adminEmail2 = 'admin2@example.com';
            const adminHashedPassword2 = await BcryptPlugin.hashPassword('adminPassword2');
            const adminAccessToken2 = JwtPlugin.createToken({
                email: adminEmail2,
                role: UserRole.ADMIN,
            });

            const user1 = {
                name: 'user1',
                email: userEmail1,
                password: userHashedPassword1,
                role: UserRole.USER,
                accessToken: userAccessToken1,
            }

            const user2 = {
                name: 'user2',
                email: userEmail2,
                password: userHashedPassword2,
                role: UserRole.USER,
                accessToken: userAccessToken2,
            }

            const user3 = {
                name: 'user3',
                email: userEmail3,
                password: userHashedPassword3,
                role: UserRole.USER,
                accessToken: userAccessToken3,
            }

            const admin1 = {
                name: 'admin1',
                email: adminEmail1,
                password: adminHashedPassword1,
                role: UserRole.ADMIN,
                accessToken: adminAccessToken1,
            }

            const admin2 = {
                name: 'admin2',
                email: adminEmail2,
                password: adminHashedPassword2,
                role: UserRole.ADMIN,
                accessToken: adminAccessToken2,
            }

            const seedsCreated = await this.seedsRepository.createSeeds([
                user1,
                user2,
                user3,
                admin1,
                admin2,
            ]);

            res.status(201).json({
                message: `Seeds created successfully`,
                status: seedsCreated,

            })

        } catch ( error ) {
            if( error instanceof CustomError) {
                next(error);
            } else {
                next(new InternalServerError('Internal Server Error'));
            }
        }
    }

}

