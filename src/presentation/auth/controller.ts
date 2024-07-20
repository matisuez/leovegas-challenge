import { 
    NextFunction,
    Request,
    Response,
} from 'express';

import { UserRole } from '../../core/entities';
import { RegisterUserDto, LoginUserDto } from '../../core/dtos';
import { AuthRepository } from '../../core/repositories/auth.repository';

import {
    CustomError,
    BadRequestError,
    InternalServerError,
    UnauthorizedError,
} from '../../core/errors/custom.error';

import {
    BcryptPlugin,
    JwtPlugin,
} from '../../config/plugins/';

export class AuthController {

    constructor(
        private readonly authRepository: AuthRepository,
    ) {}

    public login = async(req:Request, res:Response, next: NextFunction) => {

        try {
            const { email, password } = req.body;

            const user: LoginUserDto = {
                email,
            };

            const gotUser = await this.authRepository.login( user );

            const passwordMatch = await BcryptPlugin.comparePassword(password, gotUser.password);

            if (!passwordMatch) {
                throw new UnauthorizedError('Invalid credentials');
            }

            const accessToken = JwtPlugin.createToken({
                email: gotUser.email,
                role: gotUser.role,
            });

            await this.authRepository.updateAccessToken(accessToken, gotUser.email);

            res.status(200).json({
                message: `User logged`,
                accessToken: accessToken,
            });

        } catch (error) {
            if( error instanceof CustomError) {
                next(error);
            } else {
                next(new InternalServerError('Internal Server Error'));
            }
        }
        
    }

    public register = async(req:Request, res:Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            const emailExists = await this.authRepository.checkEmailExistence(email);

            if ( emailExists ) {
                throw new BadRequestError('Email already in use');
            }

            const hashedPassword = await BcryptPlugin.hashPassword(password);

            const accessToken = JwtPlugin.createToken({
                email,
                role: UserRole.USER,
            });

            const newUser: RegisterUserDto = {
                name,
                email,
                password: hashedPassword,
                accessToken,
            };

            await this.authRepository.register( newUser );

            res.status(201).json({
                message: `User registered successfully`,
                accessToken,
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

