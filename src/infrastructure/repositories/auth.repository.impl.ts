
import { UserEntity } from "../../core/entities";
import { AuthDatasource } from "../../core/datasources/auth.datasource";
import { AuthRepository } from "../../core/repositories/auth.repository";
import { LoginUserDto, RegisterUserDto } from "../../core/dtos";

export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource: AuthDatasource
    ) {}

    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.authDatasource.register(registerUserDto);
    }

    checkEmailExistence(email: string): Promise<boolean> {
        return this.authDatasource.checkEmailExistence(email);
    }

    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.authDatasource.login(loginUserDto);
    }

    updateAccessToken(accessToken: string, email: string): Promise<void> {
        return this.authDatasource.updateAccessToken(accessToken, email);
    }

}
