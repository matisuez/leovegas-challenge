
import { 
    Request,
    Response,
    NextFunction,
} from 'express';

import { UserRole } from '../../core/entities';
import { AdminUpdateUserDto } from '../../core/dtos';
import { BcryptPlugin, JwtPlugin, TokenPayload } from '../../config/plugins';
import { AdminRepository } from '../../core/repositories/admin.repository';
import { BadRequestError, CustomError, InternalServerError } from '../../core/errors/custom.error';

export class AdminController {

    constructor(
        private readonly adminRepository: AdminRepository
    ) {}

    public getAllUsers = async(req:Request, res:Response, next: NextFunction) => {
        try {
            const users = await this.adminRepository.getAllUsers();
    
            res.status(200).json({
                message: `All users, total ${ users.length }`,
                users,
            });

        } catch (error) {
            if( error instanceof CustomError) {
                next(error);
            } else {
                next(new InternalServerError('Internal Server Error'));
            }
        }
    }

    public updateUser = async(req:Request, res:Response, next: NextFunction) => {
        try {

            const { email:userEmail} = req.params;
            const { email:adminEmail, role } = res.locals.user;

            const { repeatedPassword, ...body } = req.body;
            
            if ( adminEmail === userEmail ) {
                throw new BadRequestError(`You can't update yourself`);

            }

            const adminUpdateUserDto:AdminUpdateUserDto = {
                userEmail,
                ...body,
            };

            if ( adminUpdateUserDto.password ) {
                adminUpdateUserDto.password = await BcryptPlugin.hashPassword( adminUpdateUserDto.password );
            }

            if ( adminUpdateUserDto.email || adminUpdateUserDto.role ) {

                const newToken:TokenPayload = { email: '', role: UserRole.USER };

                if ( !adminUpdateUserDto.role ) {
                    const userRole = await this.adminRepository.getUserRole( userEmail );
                    newToken.role = userRole;
                } else {
                    newToken.role = adminUpdateUserDto.role;
                }

                if ( adminUpdateUserDto.email ) {
                    newToken.email = adminUpdateUserDto.email;
                } else {
                    newToken.email = userEmail;
                }

                adminUpdateUserDto.accessToken = JwtPlugin.createToken( newToken );
            }

            const user = await this.adminRepository.updateUser( adminUpdateUserDto );

            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: user.accessToken,
            });

        } catch (error) {
            if( error instanceof CustomError) {
                next(error);
            } else {
                next(new InternalServerError('Internal Server Error'));
            }
        }
        
    }

    public deleteUser = async(req:Request, res:Response, next: NextFunction) => {
        try {
            const { email:adminEmail } = res.locals.user;

            const { email } = req.params;

            if ( adminEmail === email ) {
                throw new BadRequestError(`You can't delete yourself`);
            }

            const user = await this.adminRepository.delete(email);

            res.status(200).json({
                message: `User deleted`,
                email,
                role: user.role,
            });

        } catch (error) {
            if( error instanceof CustomError) {
                next(error);
            } else {
                next(new InternalServerError('Internal Server Error'));
            }
        }
    }

}

