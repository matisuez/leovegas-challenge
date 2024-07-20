import { UpdateUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class UsersDatasource {
    abstract getMyInfo(email:string): Promise<UserEntity>;
    abstract updateMyInfo(updateUserDto:UpdateUserDto): Promise<UserEntity>;
}
