import { 
    NextFunction,
    Request,
    Response,
} from 'express';

import { UpdateUserDto } from '../../core/dtos';
import { BcryptPlugin, JwtPlugin } from '../../config/plugins';
import { UsersRepository } from '../../core/repositories/users.repository';
import { CustomError, InternalServerError } from '../../core/errors/custom.error';
export class UsersController {

    constructor(
        private readonly usersRepository: UsersRepository
    ) {}

    public getMyInfo = async(req:Request, res:Response, next: NextFunction) => {
        try {
            const { email } = res.locals.user;

            const user = await this.usersRepository.getMyInfo(email);

            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

        } catch (error) {
            if( error instanceof CustomError) {
                return next(error);
            } else {
                return next(new InternalServerError('Internal Server Error'));
            }
        }
    }

    public updateMyInfo = async(req:Request, res:Response, next: NextFunction) => {
        try {
            const { email:userEmail, role } = res.locals.user;
            const { repeatedPassword, ...body } = req.body;
            const updateUserDto:UpdateUserDto = {
                userEmail,
                ...body,
            }

            if ( updateUserDto.password ) {
                updateUserDto.password = await BcryptPlugin.hashPassword( updateUserDto.password );
            }

            if ( updateUserDto.email ) {
                updateUserDto.accessToken = JwtPlugin.createToken({
                    email: updateUserDto.email,
                    role,
                });
            }

            const user = await this.usersRepository.updateMyInfo( updateUserDto );
            
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: user.accessToken,
            });

        } catch (error) {
            if( error instanceof CustomError) {
                return next(error);
            } else {
                return next(new InternalServerError('Internal Server Error'));
            }
        }
    }

}

