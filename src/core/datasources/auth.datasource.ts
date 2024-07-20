import { LoginUserDto, RegisterUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class AuthDatasource {
    abstract checkEmailExistence(email:string): Promise<boolean>;
    abstract login(loginUserDto:LoginUserDto): Promise<UserEntity>;
    abstract register(registerUserDto:RegisterUserDto): Promise<UserEntity>;
    abstract updateAccessToken(accessToken: string, email: string): Promise<void>;
}
